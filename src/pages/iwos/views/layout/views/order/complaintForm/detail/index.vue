<template>
  <div class="ComplaintDetail public-background">
    <ELScrollbar class="base-info">
      <div class="main-title">用户信息</div>
      <div class="cusName">{{ userInfo.custName || '客户姓名' }}</div>
      <el-rate v-model="userInfo.custLevel" class="rate" disabled-void-color="#C6D1DE" :max="7" score-template="{value}星用户" show-score disabled></el-rate>
      <TextLine labelWidth="0.9rem" :col="3" :list="textLineList1" style="font-size: 12px;"></TextLine>
      <UserTag class="UserTag" :userProfile="userProfile"></UserTag>
      <div class="main-title">工单基本信息</div>
      <TextLine labelWidth="1.4rem" :list="textLineList2" style="font-size: 14px;"></TextLine>
    </ELScrollbar>
    <ELScrollbar class="create-order-container">
      <div class="create-order-header">投诉单</div>
      <div class="create-order-form">
        <FormModel v-if="formConfig" ref="FormModelRef" :formConfig="formConfig" @onFormLoaded="onFormLoaded"></FormModel>
      </div>
    </ELScrollbar>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import UserTag from "@/pages/iwos/components/UserTag.vue";
import TextLine from "@/components/TextLine.vue";
import FormModel from "@/components/FMGenerator/FormModel";
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config/index";
import testJson from "@/components/FMGenerator/FMDesigner/components/jsonComps/投诉单模板.js";

const {proxy} = getCurrentInstance();
const FormModelRef = ref();
const formConfig = ref();

const formData = ref({});

const userInfo = ref({
  custName: '客户姓名', custLevel: 0
});

async function onFormLoaded(v) {
  console.log('formDataChange', v)
  formData.value = v;
  if (!proxy.$$lodash.get(formData.value, 'complaint.complaintAssetNum')) return;
  //没有存性别和生日
  const {res, err} = await proxy.$$api.crm.queryCommonCustInfo({
    loading: !1, data: {
      accNumber: proxy.$$lodash.get(formData.value, 'complaint.complaintAssetNum'),
      lanId: proxy.$$lodash.get(formData.value, 'complaint.lanId')
    }
  });
  userInfo.value = {
    custName: proxy.$$lodash.get(formData.value, 'complaint.custName'),
    custLevel: proxy.$$lodash.get(formData.value, 'complaint.userStarLevel') ?? 0,
    gender: res?.gender,
    birthdayFlag: res?.birth ? proxy.$$dayjs(proxy.$$dateFormatterYMD(proxy.$$dayjs())).isSame(res.birth) : false
  }
}

const userProfile = computed(() => {
  const importantCustomer = proxy.$$lodash.get(formData.value, 'complaint.importantCustomer');
  const netAge = proxy.$$lodash.get(formData.value, 'complaint.netAge');
  const custAge = proxy.$$lodash.get(formData.value, 'complaint.custAge');
  const cityFlag = proxy.$$lodash.get(formData.value, 'complaint.cityFlag');
  const governmentEnterprisekeyPerson = proxy.$$lodash.get(formData.value, 'complaint.governmentEnterprisekeyPerson');
  const custType = proxy.$$lodash.get(formData.value, 'complaint.custType');

  return {
    gender: userInfo.value?.gender,
    birthdayFlag: userInfo.value?.birthdayFlag,
    tagList: [
      importantCustomer == '1' ? '重要客户' : null,
      !proxy.$$isEmpty(netAge) ? `网龄${netAge}年` : null,
      !proxy.$$isEmpty(custAge) ? `${custAge}岁` : null,
      cityFlag && proxy.$store.getters["dictionaries/MATCH_LABEL"]("cus_city", cityFlag),
      governmentEnterprisekeyPerson == '1' ? '关键政企客户' : null,
      custType ? `${proxy.$store.getters["dictionaries/MATCH_LABEL"]("customer_strategy_grouping", custType)}` : null,
    ]
  }
});

const textLineList1 = computed(() => [
  {label: '号码归属地：', value: proxy.$$lodash.get(formData.value, 'complaint.phoneLocal')},
  {label: '工单满意：', value: proxy.$$lodash.get(formData.value, 'complaint.satisfactionEstima30days')},
  {label: '工单不满意：', value: proxy.$$lodash.get(formData.value, 'complaint.dissatisfactionEstima30days')},
  {label: '重复投诉：', value: proxy.$$lodash.get(formData.value, 'complaint.recmplntTimes30days')},
  {label: '越级投诉：', value: proxy.$$lodash.get(formData.value, 'complaint.croscmplntTimes30days')},
  {label: '退费记录：', value: proxy.$$lodash.get(formData.value, 'complaint.refundRecords90days')},
  {label: '业务号码：', value: proxy.$$lodash.get(formData.value, 'complaint.complaintAssetNum'), col: 2},
  {label: '主叫号码：', value: proxy.$$lodash.get(formData.value, 'complaint.callerNo'), col: 2},
  {label: '联系电话1：', value: proxy.$$lodash.get(formData.value, 'complaint.contactPhone1'), col: 2},
  {label: '联系电话2：', value: proxy.$$lodash.get(formData.value, 'complaint.contactPhone2'), col: 2},
]);

const textLineList2 = computed(() => [
  {label: '工单类型：', value: '投诉单'},
  {label: '统一投诉编码：', value: proxy.$$lodash.get(formData.value, 'complaint.unifiedComplaintCode')},
  {label: '申诉工单编号：', value: proxy.$$lodash.get(formData.value, 'complaint.appealWorksheetId')},
  {label: '集团工单编号：', value: proxy.$$lodash.get(formData.value, 'complaint.complaintWorksheetId')},
  {label: '省内工单编号：', value: proxy.$$lodash.get(formData.value, 'complaint.worksheetId')},
  {label: '呼叫流水号：', value: proxy.$$lodash.get(formData.value, 'complaint.callId')},
  {label: '录音流水号：', value: proxy.$$lodash.get(formData.value, 'complaint.recordingId')},
  {label: '申诉日期：', value: proxy.$$lodash.get(formData.value, 'complaint.appealDateStr')},
  {label: '申诉用户姓名：', value: proxy.$$lodash.get(formData.value, 'complaint.appealUserName')},
  {label: '建单时间：', value: proxy.$$lodash.get(formData.value, 'complaint.provinceOrderCreateTimeStr')},
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
  padding: 4px 16px !important;
  overflow: hidden;

  .main-title {
    font-size: 18px;
  }

  .cusName {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .UserTag {
    margin: 24px 0;
  }

  .rate {
    margin-bottom: 12px;
  }

  & > div {
    height: 100%;
    overflow: hidden;
  }

  .base-info {
    width: 450px;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .create-order-container {
    flex-grow: 1;
  }
}
</style>
