<template>
  <div>
    <el-collapse v-model="collapseHead">
      <el-collapse-item title="" name="1">
        <template #title>
          <div class="custom-title">
            <div class="searchParams">
              <span class="searchParams_text">用户视图</span>
              <div>
                <el-input v-model="accNum" clearable placeholder="请输入设备号" @click.stop.native @keyup.enter.space.stop.native="getInfo({from:'手动'})">
                  <el-select v-model="accType" slot="prepend">
                    <el-option label="移动手机" value="12"></el-option>
                    <el-option label="宽带" value="11"></el-option>
                    <el-option label="固话" value="10"></el-option>
                  </el-select>
                </el-input>
              </div>
              <div>
                <el-button type="primary" size="small" class="search_btn" @click.stop="getInfo({from:'手动'})">查询</el-button>
                <el-button type="danger" size="small" class="search_btn" @click.stop="getInfo({isForce:!0,from:'手动'})">更新查询</el-button>
                <el-button type="warning" size="small" class="search_btn" @click.stop="diagnosisHandleInfo()">一键信息获取</el-button>
              </div>
            </div>
          </div>
          <div class="operationBtn">{{ collapseHead.includes('1') ? '收起' : '展开' }}</div>
        </template>

        <div class="UserContent">
          <div class="UserContent_Text">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="firstRow">
                  <!--                  <el-avatar :size="50" :src="state.userInfo.circleUrl"></el-avatar>-->
                  <div class="secondRow">
                    <div>{{ state.userInfo.custName }}</div>
                    <el-rate v-model="state.userInfo.custLevel" disabled-void-color="#C6D1DE" :max="7" score-template="{value}星用户" show-score disabled></el-rate>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="rowPadding">
              <el-col :span="8">
                <div>号码归属地：<span class="showData">{{ state.userInfo.phoneLocal }}</span></div>
              </el-col>
              <el-col :span="4">
                <div>30天满意评价：<span class="showData">{{ state.userInfo.thirtyDaysOrderSatisfied }}</span></div>
              </el-col>
              <el-col :span="4">
                <div>30天不满意评价：<span class="showData">{{ state.userInfo.thirtyDaysOrderDissatisfied }}</span></div>
              </el-col>
              <el-col :span="4">
                <div>30天重复投诉：<span class="showData">{{ state.userInfo.repeatedComplaintsThirtyDays }}</span></div>
              </el-col>
              <el-col :span="4">
                <div>30天越级投诉：<span class="showData">{{ state.userInfo.complaintsExceedingLevelThirtyDays }}</span></div>
              </el-col>
              <!--              <el-col :span="6">-->
              <!--                <div>-->
              <!--                  退费记录：<span class="showData">{{-->
              <!--                    state.userInfo.ninetyDaysRefundRecord-->
              <!--                  }}</span>-->
              <!--                </div>-->
              <!--              </el-col>-->
              <!--              <el-col :span="6">-->
              <!--                <div>-->
              <!--                  客户升级投诉倾向：-->
              <!--                  <span class="showData">{{ state.userInfo.complaintLevelUp }}</span>-->
              <!--                </div>-->
              <!--              </el-col>-->
            </el-row>
          </div>
          <div class="UserPortrait">
            <UserTag class="one-screen-fg0" :userProfile="state.userProfile"></UserTag>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import UserTag from "./UserTag.vue";
import {getCurrentInstance, onBeforeMount, ref, watch} from "vue";
import {getTypePrefix} from "@/pages/iwos/views/layout/views/system/template/config";

const {proxy} = getCurrentInstance();
const collapseHead = ref(['1']);
const accNum = ref('');
const accType = ref('12');
const redirectInfo = ref(null);

function reset() {
  return {
    userInfo: {
      repeatedComplaintsThirtyDays: '-',//  30天重复投诉次数
      complaintsExceedingLevelThirtyDays: '-',//      30天越级投诉次数
      ninetyDaysRefundRecord: '-',//      90天退费记录
      thirtyDaysOrderSatisfied: '-',//      30天工单评价-满意
      thirtyDaysOrderDissatisfied: '-',//   30天工单评价-不满意
      refundValue: "-",
      phoneLocal: "-",
      custLevel: 0,
      custName: "客户姓名",
    },
    userProfile: {
      gender: '0',
      birthdayFlag: false,
      tagList: [],
    },
  }
}

const state = ref(reset());

// 工单编号 进来先调用 后续接口都要
const complaintWorksheetId = ref(null);

async function getComplaintWorksheetId(cb) {
  if (proxy.$route.query.complaintWorksheetId) {
    complaintWorksheetId.value = proxy.$route.query.complaintWorksheetId;//保持complaintWorksheetId
    return cb && cb();
  }
  const {res, err} = await proxy.$$api.complaint.getComplaintWorksheetId({});
  if (res?.value) {
    complaintWorksheetId.value = res.value;
    return cb && cb();
  }
  proxy.$$Dialog.confirm('集团工单编号获取失败', '提示', {showCancelButton: false}).catch(proxy.$$emptyFn);
}

// '0': 'public',    '1': 'scene',    '2': 'ext',    '3': 'comm',
async function diagnosisHandleInfo() {
  if (!complaintWorksheetId.value) return;
  if (!accNum.value) return proxy.$$Toast({message: `请先输入设备号`, type: 'error'});
  const {res, err} = await proxy.$$api.complaint.diagnosisHandleInfo({
    data: {accNum: accNum.value},
    headers: {'complaintWorksheetId': complaintWorksheetId.value ?? '', 'complaintAssetNum': accNum.value ?? ''}
  });
  if (res) {
    proxy.$emit('diagnosisChange', (res.fieldList || []).reduce((t, c) => {
      if (c.type == 0) t[c.name] = c.value;
      else t[`${getTypePrefix(c.type)}${c.name}`] = c.value;
      return t;
    }, {
      callId: res.callId, complaintDescription: res.complaintDescription
    }));
  }
}

const h = proxy.$createElement;

//查询是否有在途单
async function queryPendingWorkOrderByAssetNum(accNum) {
  if (proxy.$route.params.workorderId) return true;
  const {res: qpRes} = await proxy.$$api.complaint.queryPendingWorkOrderByAssetNum({
    params: {assetNum: accNum},
    headers: {'complaintWorksheetId': complaintWorksheetId.value ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  if (qpRes?.pendingWorkOrderFlag >= 1) {
    const c = await proxy.$$Dialog.confirm(h('p', null, [
      h('span', null, '该设备号存在 '),
      h('span', {
        style: 'color: #409eff;text-decoration-line: underline;cursor: pointer;', on: {
          click: () => {
            proxy.$$Dialog.close()
            proxy.$router.push({name: 'ComplaintForm', query: {accNum, status: 'C200001'}})
          }
        }
      }, '在途工单'),
      h('span', null, ' ，是否继续新建？')
    ]), '提示').catch(proxy.$$emptyFn);
    return c === 'confirm';
  }
  return true;
}

async function getInfo({isForce, from}) {

  // 如果在详情内重新查询 那么重新重置表单数据初始化 并保持complaintWorksheetId不变
  if (from === '手动' && proxy.$route.params.workorderId && accNum.value) return proxy.$router.replace({
    name: 'ComplaintCreate', query: {
      accNum: accNum.value,
      complaintWorksheetId: complaintWorksheetId.value,
    }
  });

  if (!complaintWorksheetId.value) return;//1.必须先获取集团工单编号

  if (!accNum.value) return proxy.$$Toast({message: `请先输入设备号`, type: 'error'});

  if (!(await queryPendingWorkOrderByAssetNum(accNum.value))) return;//2.查询在途单

  //3.H码查询 移动设备才需要调用H码查询，其他没有
  let res = null, err = null;
  if (accType.value === '12') {
    const R = await proxy.$$api.crm.getHNumber({
      params: {segment: accNum.value},
      headers: {'complaintWorksheetId': complaintWorksheetId.value ?? '', 'complaintAssetNum': accNum.value ?? ''}
    });
    res = R?.res;
    err = R?.err;
  }
  if (!res) res = {//如果H码查询失败 或者没有结果 那么把坐席归属省填入
    lanid: proxy.$store.getters['user/GET_USER_PROVINCE_CODE'],
    provinceCode: proxy.$store.getters['user/GET_USER_PROVINCE_CODE']
  };

  if (res) {
    const [R1, R2, R3] = await Promise.all([
      proxy.$$api.crm[isForce ? 'queryForceCustInfo' : 'queryCommonCustInfo']({
        data: {accNumber: accNum.value, lanId: res.lanid},
        headers: {'complaintWorksheetId': complaintWorksheetId.value ?? '', 'complaintAssetNum': accNum.value ?? ''}
      }),
      proxy.$$api.crm.sourceCountUserPicuture({
        params: {complaintAssetNum: accNum.value},
        headers: {'complaintWorksheetId': complaintWorksheetId.value ?? '', 'complaintAssetNum': accNum.value ?? ''}
      }),
      proxy.$$api.crm.eCProduct({
        params: {lanId: res.lanid, serialNumber: accNum.value, prodClass: accType.value},
        headers: {'complaintWorksheetId': complaintWorksheetId.value ?? '', 'complaintAssetNum': accNum.value ?? ''}
      })
    ]);

    const {res: ecpRes, err: ecpErr} = {res: R3?.res?.list?.[0], err: R3?.err};//设备信息
    if (ecpRes) {
      ecpRes.phoneLocal = [ecpRes.province, ecpRes.city].join('-');
      state.value.userInfo.phoneLocal = ecpRes.phoneLocal || '-';
    }

    const {res: scupRes, err: scupErr} = R2;
    if (scupRes) {
      state.value.userInfo.repeatedComplaintsThirtyDays = scupRes?.repeatedComplaintsThirtyDays ?? '-';
      state.value.userInfo.complaintsExceedingLevelThirtyDays = scupRes?.complaintsExceedingLevelThirtyDays ?? '-';
      state.value.userInfo.ninetyDaysRefundRecord = scupRes?.ninetyDaysRefundRecord ?? '-';
      state.value.userInfo.thirtyDaysOrderSatisfied = scupRes?.thirtyDaysOrderSatisfied ?? '-';
      state.value.userInfo.thirtyDaysOrderDissatisfied = scupRes?.thirtyDaysOrderDissatisfied ?? '-';
    }

    const {res: iRes, err: iErr} = R1;
    if (iRes) {
      //带m_自己算的 和接口区分开
      iRes.m_netAge = iRes?.netAccess ? proxy.$$dayjs().diff(iRes.netAccess, 'year') : null;

      // 存储定位后数据 后续用
      proxy.$store.commit('storage/SET_STORAGE', {
        key: 'customPositioning', value: {
          complaintWorksheetId: complaintWorksheetId.value, accType: accType.value, accNum: accNum.value,
          eCProductInfo: ecpRes, lanIdInfo: res, custom: iRes, redirectInfo: redirectInfo.value
        }
      });

      if (from !== '详情') proxy.$emit('change');//变化通知 详情时不触发

      state.value.userInfo.complaintLevelUp = iRes?.complaintLevelUp ?? '-';
      state.value.userInfo.custLevel = parseInt(iRes?.custLevel ?? '0') ?? 0;
      state.value.userInfo.custName = iRes?.custName || '-';
      state.value.userInfo.recmplntTimesDays = iRes?.recmplntTimesDays ?? '-';
      state.value.userProfile.gender = iRes?.gender;
      // iRes.birth = '2022-09-07'
      state.value.userProfile.birthdayFlag = iRes?.birth ? proxy.$$dayjs(proxy.$$dateFormatterYMD(proxy.$$dayjs())).isSame(iRes.birth) : false;

      state.value.userProfile.tagList = [
        iRes?.isImportant === '是' ? "重要客户" : null,
        !proxy.$$isEmpty(iRes?.m_netAge) ? `网龄${iRes.m_netAge}年` : null,
        !proxy.$$isEmpty(iRes?.custAge) ? `${iRes.custAge}岁` : null,
        iRes?.cityFlagName ?? null,
        iRes?.isGovernment === '是' ? "政企关键人" : null,
        iRes?.custTypeName ? `${iRes.custTypeName}客户` : null,
      ];

      console.log("获取用户详情", res);
      return;
    }
  }
  state.value = reset();
}

async function getDetail() {
  //如果设备号 工单id都带过来了 那就不调详情了
  if (proxy.$route.query.complaintAssetNum && proxy.$route.query.complaintWorksheetId) {
    accNum.value = proxy.$route.query.complaintAssetNum;
    complaintWorksheetId.value = proxy.$route.query.complaintWorksheetId;
    return getInfo({from: '详情'});
  }
  //查询详情
  const {res, err} = await proxy.$$api.complaint.complaintWorkOrderDetail({
    workorderId: proxy.$route.params.workorderId,
    headers: {'complaintWorksheetId': proxy.$route.query.complaintWorksheetId ?? '', 'complaintAssetNum': proxy.$route.query.complaintAssetNum ?? ''}
  });
  if (res) {
    accNum.value = res?.complaintAssetNum;
    complaintWorksheetId.value = res?.complaintWorksheetId;
    getInfo({from: '详情'});
  }
}

watch(() => proxy.$route.params.workorderId, () => {
  state.value = reset();
  proxy.$emit('reset');
  if (proxy.$route.params.workorderId) return getDetail();

  //有进入设备号
  if (proxy.$route.query.accNum) {
    accNum.value = proxy.$route.query.accNum;
    getComplaintWorksheetId(() => getInfo({from: '手动'}));
  }
});

//重置
const resetId = ref('');
watch(() => proxy.$route.query.reset, () => {
  if (resetId.value === proxy.$route.query.reset) return;
  state.value = reset();
  accNum.value = null;
  proxy.$emit('reset');
  getComplaintWorksheetId();
});

onBeforeMount(() => {
  proxy.$store.commit('storage/REMOVE_STORAGE', ['customPositioning']);

  if (proxy.$route.params.workorderId) return getDetail();

  //有进入设备号
  if (proxy.$route.query.accNum) {
    accNum.value = proxy.$route.query.accNum;
    return getComplaintWorksheetId(() => getInfo({from: '手动'}));
  }

  if (proxy.$route.query.p) {
    try {
      redirectInfo.value = JSON.parse(decodeURIComponent(proxy.$route.query.p || null));
      if (redirectInfo.value) {
        accNum.value = redirectInfo.value.accNum;
        if (accNum.value) getComplaintWorksheetId(() => getInfo({from: '手动'}));
      }
    } catch (e) {
      console.log('parse err', e);
    }
    return;
  }
  getComplaintWorksheetId();
});

</script>
<script>
export default {
  webDicts: ['base_province_code', 'cus_city']
}
</script>
<style lang="scss" scoped>
::v-deep(.el-input__prefix) {
  font-size: 20px;
  line-height: 50px;
}

::v-deep(.el-select .el-input) {
  width: 106px;
}

::v-deep(.input-with-select .el-input-group__prepend) {
  background-color: #fff;
}

.custom-title {
  width: 100%;

  .searchParams {
    display: flex;
    align-items: center;
    padding: 0 20px;

    .searchParams_text {
      color: $main-text !important;
      font-size: 17px;
      font-weight: 500;
      padding-right: 8px;
    }
  }

  .search_btn {
    margin-left: 8px;
  }
}

.operationBtn {
  width: 30px;
  font-size: 14px;
  font-weight: bold;
  color: rgb(50, 151, 255);
  white-space: nowrap;
}

::v-deep .el-collapse-item__header {
  background-color: rgb(237, 244, 254);
  border-bottom: 1px solid #e2e6f1;

  &:hover {
    color: $main-text;
  }
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.UserContent {
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  background-color: #edf4fe;

  .UserContent_Text {
    flex-grow: 1;
    padding: 16px 20px;
    border-right: 1px solid #e2e6f1;

    .el-row:nth-child(1) {
      padding-bottom: 10px;
    }

    .firstRow {
      display: flex;
      align-items: center;
    }

    .secondRow {
      div {
        font-size: 20px;
        font-weight: 600;
      }
    }

    .rowPadding {
      font-size: 16px;
      line-height: 2;

      .showData {
        padding-left: 5px;
        font-weight: bold;
      }
    }
  }

  .UserPortrait {
    width: 480px;
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
