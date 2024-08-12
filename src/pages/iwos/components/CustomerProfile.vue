<template>
  <div>
    <el-collapse v-model="collapseHead">
      <el-collapse-item title="" name="1">
        <template #title>
          <div class="custom-title">
            <div class="searchParams">
              <span class="searchParams_text">用户视图</span>
              <div>
                <el-input v-model="accNum" clearable placeholder="请输入" @click.stop.native @keyup.enter.space.stop.native="getInfo()">
                  <el-select v-model="accType" slot="prepend">
                    <el-option label="移动手机" value="12"></el-option>
                    <el-option label="宽带" value="11"></el-option>
                    <el-option label="固话" value="10"></el-option>
                  </el-select>
                </el-input>
              </div>
              <div>
                <el-button type="primary" size="small" class="search_btn" @click.stop="getInfo()">查询</el-button>
                <el-button type="danger" size="small" class="search_btn" @click.stop="getInfo(!0)">更新查询</el-button>
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
            <el-row :gutter="20" class="rowPadding">
              <el-col :span="6">
                <div>
                  号码归属地：
                  <span class="showData">{{ state.userInfo.oneLevel }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  工单满意：
                  <span class="showData">{{
                      state.userInfo.thirtyDaysOrderSatisfied
                    }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  工单不满意：
                  <span class="showData">{{
                      state.userInfo.thirtyDaysOrderDissatisfied
                    }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="rowPadding">
              <el-col :span="6">
                <div>
                  重复投诉：
                  <span class="showData">{{
                      state.userInfo.repeatedComplaintsThirtyDays
                    }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  越级投诉：
                  <span class="showData">{{
                      state.userInfo.complaintsExceedingLevelThirtyDays
                    }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  退费记录：<span class="showData">{{
                    state.userInfo.ninetyDaysRefundRecord
                  }}</span>
                </div>
              </el-col>
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
import {getCurrentInstance, ref} from "vue";

const {proxy} = getCurrentInstance();
const collapseHead = ref(['1']);
const accNum = ref('18931177956');
const accType = ref('12');

function reset() {
  return {
    userInfo: {
      repeatedComplaintsThirtyDays: '-',//  30天重复投诉次数
      complaintsExceedingLevelThirtyDays: '-',//      30天越级投诉次数
      ninetyDaysRefundRecord: '-',//      90天退费记录
      thirtyDaysOrderSatisfied: '-',//      30天工单评价-满意
      thirtyDaysOrderDissatisfied: '-',//   30天工单评价-不满意
      refundValue: "-",
      oneLevel: "-",
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

async function getInfo(isForce) {
  if (!accNum.value) return;
  const {res, err} = await proxy.$$api.crm.getHNumber({params: {segment: accNum.value.slice(0, 7)}});//segment
  if (res) {
    const [R1, R2] = await Promise.all([
      proxy.$$api.crm[isForce ? 'queryForceCustInfo' : 'queryCommonCustInfo']({data: {accNumber: accNum.value, lanId: res.lanid}}),
      proxy.$$api.crm.sourceCountUserPicuture({})
    ]);
    const {res: scupRes, err: scupErr} = R2;
    if (scupRes) {
      state.value.userInfo.repeatedComplaintsThirtyDays = scupRes?.repeatedComplaintsThirtyDays || '-';
      state.value.userInfo.complaintsExceedingLevelThirtyDays = scupRes?.complaintsExceedingLevelThirtyDays || '-';
      state.value.userInfo.ninetyDaysRefundRecord = scupRes?.ninetyDaysRefundRecord || '-';
      state.value.userInfo.thirtyDaysOrderSatisfied = scupRes?.thirtyDaysOrderSatisfied || '-';
      state.value.userInfo.thirtyDaysOrderDissatisfied = scupRes?.thirtyDaysOrderDissatisfied || '-';
    }
    const {res: iRes, err: iErr} = R1;
    if (iRes) {
      // 存储定位后数据 后续用
      proxy.$store.commit('storage/SET_STORAGE', {key: 'customPositioning', value: {lanIdInfo: res, custom: iRes, accType: accType.value, accNum: accNum.value}});
      proxy.$emit('change');//变化通知
      state.value.userInfo.complaintLevelUp = iRes?.complaintLevelUp || '-';
      state.value.userInfo.custLevel = parseInt(iRes?.custLevel ?? '0') || 0;
      state.value.userInfo.custName = iRes?.custName || '-';
      state.value.userInfo.oneLevel = res?.oneLevel || '-';
      state.value.userInfo.recmplntTimesDays = iRes?.recmplntTimesDays || '-';
      state.value.userProfile.gender = iRes?.gender;
      // iRes.birth = '2022-09-07'
      state.value.userProfile.birthdayFlag = iRes?.birth ? proxy.$$dayjs(proxy.$$dateFormatterYMD(proxy.$$dayjs())).isSame(iRes.birth) : false;

      state.value.userProfile.tagList = [
        iRes?.isImportant === '是' ? "重要客户" : null,
        iRes?.netAccess ? `网龄${proxy.$$dayjs().diff(iRes.netAccess, 'year')}年` : null,
        iRes?.custAge ? `${iRes.custAge}岁` : null,
        iRes?.cityFlagName ?? null,
        iRes?.isGovernment === '是' ? "关键政企客户" : null,
        iRes?.custTypeName ? `${iRes.custTypeName}客户` : null,
      ].filter(r => !!r);

      console.log("获取用户详情", res);
      return;
    }
  }
  state.value = reset();
  // state.value.userInfo = {
  //   belongingPlace: "上海",
  //   satisfaction: "2",
  //   dissatisfied: "1",
  //   duplicateValue: "1",
  //   TranscendingLevelsValue: "2",
  //   refundValue: "2",
  //   ComplaintTendency: "0",
  //   score: 4.7,
  //   circleUrl:
  //       "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
  // };
  // state.value.userProfile.tagList = [
  //   "重要客户",
  //   "网龄19年",
  //   "36岁",
  //   "城镇",
  //   "政企关键人",
  //   "公众客",
  // ];
}
</script>
<script>
export default {
  cusDicts: ['base_province_code', 'cus_city']
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
    padding: 0px 32px;

    .searchParams_text {
      color: #000000 !important;
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
    color: #000000;
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
    padding: 20px 32px;
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
      margin-top: 12px;
      font-size: 16px;
      line-height: 2;

      .showData {
        padding-left: 5px;
      }
    }
  }

  .UserPortrait {
    width: 480px;
    flex-grow: 0;
    flex-shrink: 0;
    padding-top: 20px;
  }
}
</style>
