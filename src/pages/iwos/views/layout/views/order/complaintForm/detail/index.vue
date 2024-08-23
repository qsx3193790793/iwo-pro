<template>
  <div class="ComplaintDetail">
    <ELScrollbar class="base-info public-background">
      <div class="main-title-1">用户信息</div>
      <div class="cusName">{{ userInfo.custName || '客户姓名' }}</div>
      <el-rate v-model="userInfo.custLevel" class="rate" disabled-void-color="#C6D1DE" :max="7" score-template="{value}星用户" show-score disabled></el-rate>
      <template v-for="item in tagList1">
        <el-tag v-if="item.value" style="margin:0 0.2rem 0.1rem 0;" :key="item.label" type="warning" size="medium" color="#f49e47" effect="dark"> {{ item.value }}</el-tag>
      </template>
      <TextLine labelColor="#a7abb4" labelWidth="1.36rem" :list="textLineList1" style="font-size: 14px;margin: 15px 0;"></TextLine>
      <div class="tag-body" :style=" `border: 2px solid ${item.color}`" v-for="item in evaluateTagList" :key="item.label">
        <div class="tag-name" :style="`color:${item.color}`">{{ item.label }}</div>
        <div class="tag-number" :style="`background-color: ${item.color};`">{{ item.value || '0' }}</div>
      </div>
      <el-divider></el-divider>
      <!-- <UserTag class="UserTag" :userProfile="userProfile"></UserTag> -->
      <div class="main-title-1">工单基本信息</div>
      <TextLine labelWidth="1.36rem" :list="textLineList2" style="font-size: 14px;" labelColor="#a7abb4"></TextLine>
      <el-divider></el-divider>
      <div class="main-title-1">服务轨迹</div>
      <div class="service-trajectory">
        <el-badge :value="200" :max="99" style="cursor: pointer;">
          <div> <i class="el-icon-document-copy service-trajectory-icon"></i></div>
          <div>历史工单</div>
        </el-badge>
        <el-badge :value="200" :max="99" style="cursor: pointer;">
          <div><i class=" el-icon-paperclip service-trajectory-icon"></i></div>
          <div>附件列表</div>
        </el-badge>
      </div>
    </ELScrollbar>
    <ELScrollbar class="create-order-container public-background">
      <!--      <div class="create-order-header">投诉单</div>-->
      <div class="create-order-form">
        <FormModel v-if="formConfig" ref="FormModelRef" :formConfig="formConfig" formStatus="view" @onFormLoaded="onFormLoaded">
          <template #ext="root">
            <FileUploader :root="root"></FileUploader>
          </template>
        </FormModel>
      </div>
    </ELScrollbar>

  </div>
</template>

<script setup>
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import TextLine from "@/components/TextLine.vue";
import FileUploader from "../components/FileUploader";
import FormModel from "@/components/FMGenerator/FormModel";
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config/index";
import testJson from "@/components/FMGenerator/FMDesigner/components/jsonComps/投诉单详情模板.js";

const {proxy} = getCurrentInstance();
const FormModelRef = ref();
const formConfig = ref();

const formData = ref({});

const userInfo = ref({
  custName: '客户姓名', custLevel: 0
});

async function onFormLoaded(v) {
  formData.value = v;
  if (!proxy.$$lodash.get(formData.value, 'complaintAssetNum')) return;
  //没有存性别和生日
  const {res, err} = await proxy.$$api.crm.queryCommonCustInfo({
    loading: !1, data: {
      accNumber: proxy.$$lodash.get(formData.value, 'complaintAssetNum'),
      lanId: proxy.$$lodash.get(formData.value, 'lanId')
    }
  });
  userInfo.value = {
    custName: proxy.$$lodash.get(formData.value, 'custName'),
    custLevel: proxy.$$lodash.get(formData.value, 'userStarLevel') ?? 0,
    gender: res?.gender,
    birthdayFlag: res?.birth ? proxy.$$dayjs(proxy.$$dateFormatterYMD(proxy.$$dayjs())).isSame(res.birth) : false
  }
}

// const userProfile = computed(() => {
//   const importantCustomer = proxy.$$lodash.get(formData.value, 'complaint.importantCustomer');
//   const netAge = proxy.$$lodash.get(formData.value, 'complaint.netAge');
//   const custAge = proxy.$$lodash.get(formData.value, 'complaint.custAge');
//   const cityFlag = proxy.$$lodash.get(formData.value, 'complaint.cityFlag');
//   const governmentEnterprisekeyPerson = proxy.$$lodash.get(formData.value, 'complaint.governmentEnterprisekeyPerson');
//   const custType = proxy.$$lodash.get(formData.value, 'complaint.custType');

//   return {
//     gender: userInfo.value?.gender,
//     birthdayFlag: userInfo.value?.birthdayFlag,
//     tagList: [
//       importantCustomer == '1' ? '重要客户' : null,
//       !proxy.$$isEmpty(netAge) ? `网龄${netAge}年` : null,
//       !proxy.$$isEmpty(custAge) ? `${custAge}岁` : null,
//       cityFlag && proxy.$store.getters["dictionaries/MATCH_LABEL"]("cus_city", cityFlag),
//       governmentEnterprisekeyPerson == '1' ? '关键政企客户' : null,
//       custType ? `${proxy.$store.getters["dictionaries/MATCH_LABEL"]("customer_strategy_grouping", custType)}` : null,
//     ]
//   }
// });
const tagList1 = computed(() => {
  const importantCustomer = proxy.$$lodash.get(formData.value, 'importantCustomer');
  const netAge = proxy.$$lodash.get(formData.value, 'netAge');
  const custAge = proxy.$$lodash.get(formData.value, 'custAge');
  const cityFlag = proxy.$$lodash.get(formData.value, 'cityFlag');
  const governmentEnterprisekeyPerson = proxy.$$lodash.get(formData.value, 'governmentEnterprisekeyPerson');
  const phoneLocal = proxy.$$lodash.get(formData.value, 'phoneLocal');

  return [
    {label: '归属地：', value: phoneLocal ? `归属地：${phoneLocal}` : null},
    {label: '网龄', value: !proxy.$$isEmpty(netAge) ? `网龄${netAge}年` : null},
    {label: '城市', value: cityFlag ? proxy.$store.getters["dictionaries/MATCH_LABEL"]("cus_city", cityFlag) : null},
    {label: '重要客户', value: importantCustomer == '1' ? '重要客户' : null},
    {label: '关键政企客户', value: governmentEnterprisekeyPerson == '1' ? '关键政企客户' : null},
    {label: '年龄', value: !proxy.$$isEmpty(custAge) ? `${custAge}岁` : null},
  ]
})
const evaluateTagList = computed(() => [
  {label: '满意', value: proxy.$$lodash.get(formData.value, 'satisfactionEstima30days'), color: '#68b14e'},
  {label: '越级', value: proxy.$$lodash.get(formData.value, 'croscmplntTimes30days'), color: '#956ec8'},
  {label: '不满意', value: proxy.$$lodash.get(formData.value, 'dissatisfactionEstima30days'), color: '#d86ca0'},
  {label: '重复', value: proxy.$$lodash.get(formData.value, 'recmplntTimes30days'), color: '#6e84fe'},
  {label: '退费', value: proxy.$$lodash.get(formData.value, 'refundRecords90days'), color: '#fcc600'},
])
const textLineList1 = computed(() => [
  // {label: '号码归属地：', value: proxy.$$lodash.get(formData.value, 'complaint.phoneLocal')},
  // {label: '工单满意：', value: proxy.$$lodash.get(formData.value, 'complaint.satisfactionEstima30days')},
  // {label: '工单不满意：', value: proxy.$$lodash.get(formData.value, 'complaint.dissatisfactionEstima30days')},
  // {label: '重复投诉：', value: proxy.$$lodash.get(formData.value, 'complaint.recmplntTimes30days')},
  // {label: '越级投诉：', value: proxy.$$lodash.get(formData.value, 'complaint.croscmplntTimes30days')},
  // {label: '退费记录：', value: proxy.$$lodash.get(formData.value, 'complaint.refundRecords90days')},
  {label: '业务号码：', value: proxy.$$lodash.get(formData.value, 'complaintAssetNum')},
  {label: '主叫号码：', value: proxy.$$lodash.get(formData.value, 'callerNo')},
  {label: '联系电话1：', value: proxy.$$lodash.get(formData.value, 'contactPhone1')},
  {label: '联系电话2：', value: proxy.$$lodash.get(formData.value, 'contactPhone2')},
]);

const textLineList2 = computed(() => [
  {label: '工单类型：', value: '投诉单'},
  {label: '统一投诉编码：', value: proxy.$$lodash.get(formData.value, 'unifiedComplaintCode')},
  {label: '申诉工单编号：', value: proxy.$$lodash.get(formData.value, 'appealWorksheetId')},
  {label: '集团工单编号：', value: proxy.$$lodash.get(formData.value, 'complaintWorksheetId')},
  {label: '省内工单编号：', value: proxy.$$lodash.get(formData.value, 'worksheetId')},
  {label: '呼叫流水号：', value: proxy.$$lodash.get(formData.value, 'callId')},
  {label: '录音流水号：', value: proxy.$$lodash.get(formData.value, 'recordingId')},
  {label: '申诉日期：', value: proxy.$$lodash.get(formData.value, 'appealDate')},
  {label: '申诉用户姓名：', value: proxy.$$lodash.get(formData.value, 'appealUserName')},
  {label: '建单时间：', value: proxy.$$lodash.get(formData.value, 'provinceOrderCreateTime')},
]);

watch(() => proxy.$route.params.workorderId, () => FormModelRef.value?.init())

onMounted(() => {
  formConfig.value = parseFormModel(proxy.$$deepmerge(testJson.json));
});
</script>
<script>
export default {
  name: "ComplaintDetail",
  cusDicts: [
    "customer_strategy_grouping",
    "cus_city",
  ],
};
</script>
<style lang="scss" scoped>
.ComplaintDetail {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
  overflow: hidden;

  .main-title-1 {
    font-size: 0.18rem;
    font-weight: bold;
    color: #353535;
    margin-bottom: 24px;
  }

  .cusName {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }


  .rate {
    margin-bottom: 12px;
  }

  & > div {
    height: 100%;
    overflow: hidden;
  }

  .base-info {
    padding: 16px 0 0 16px;
    width: 400px;
    flex-shrink: 0;
    flex-grow: 0;
    margin-right: 16px;
  }

  .create-order-container {
    flex-grow: 1;
  }

  .tag-body {
    display: inline-block;
    font-size: 12px;
    line-height: 24px;
    border-radius: 2px;
    margin: 0 0.2rem 0.1rem 0;

    .tag-name {
      display: inline-block;
      padding: 0 10px;
    }

    .tag-number {
      display: inline-block;
      padding: 0 10px;
      text-align: center;
      color: white;
    }
  }
}

.service-trajectory {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin: 15px 0;
  text-align: center;
  font-size: 16px;
  font-weight: 700;

  &-icon {
    font-size: 24px;
    background-color: #e6ebf1;
    padding: 8px 4px;
    margin-bottom: 4px;
  }
}
</style>
