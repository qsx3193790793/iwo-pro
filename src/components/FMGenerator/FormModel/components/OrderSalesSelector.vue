<template>
  <div class="OrderSalesSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button v-if="!root.vm.disabled" icon="el-icon-search" @click="open"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" title="订单销售品查询" width="86%" @opened="init">
      <!--      <div class="search-bar">-->
      <!--        <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="StaffSelectorSearchFormItems"></PageSearchPanel>-->
      <!--      </div>-->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="320">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="offerName" label="销售品名称" width="240"></el-table-column>
        <el-table-column prop="offerNbr" label="销售品编码"></el-table-column>
        <el-table-column prop="prodName" label="产品名称"></el-table-column>
        <el-table-column prop="effDate" label="生效时间" width="160"></el-table-column>
        <el-table-column prop="expDate" label="失效时间" width="160"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" @click="confirm(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </MDialog>
  </div>
</template>

<script setup>
// 订单查询
import MDialog from '@/components/MDialog';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import {nextTick, getCurrentInstance, onBeforeMount, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  isShow: {type: Boolean, default: false},
  value: {type: String, default: ''},//v-model绑定
  valueKey: {type: String, default: ''},//v-model绑定 所在数据key 如果没有就不进行双向绑定 通过onConfirm自己赋值
  title: {type: String, default: ''},
  root: {type: Object, default: () => ({})},
});

const modelIsShow = ref(false);
const loading = ref(false);
const PageSearchPanelRef = ref();
const tableData = ref([]);

function confirm(row) {
  props.valueKey && proxy.$emit('input', row[props.valueKey]);
  proxy.$emit('onConfirm', row);
  modelIsShow.value = false;
  tableData.value = []
  // pageInfo.value.rowCount = 0;
  // pageInfo.value.offset = 1;
}

function open() {
  const bindKeys = proxy.root.item.reqFields?.[0];
  const formData = proxy.root.vm.getFormData();
  const orderId = proxy.$$lodash.get(formData, bindKeys.value);
  if (!orderId) return proxy.$$Toast({message: `请先填写订单编号或订单流水`, type: 'error'});
  modelIsShow.value = !0
}

// 列表请求
const getList = async () => {
  if (!props.root?.vm?.rootParams) return;
  const {lanIdInfo, complaintWorksheetId, accType, accNum} = props.root.vm?.rootParams || {};
  const bindKeys = proxy.root.item.reqFields?.[0];
  const formData = proxy.root.vm.getFormData();
  const orderId = proxy.$$lodash.get(formData, bindKeys.value);
  const {res, err} = await proxy.$$api.crm.customerOrderDetail({
    data: Object.assign({orderId}, {lanId: lanIdInfo.lanid, prodClass: accType}),
    headers: {'complaintWorksheetId': complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  if (err) return;
  tableData.value = (res?.orderItems || []).map(r => (Object.assign({
    orderItemId: r.orderItemId,
    serviceOfferId: r.serviceOfferId,
  }, r?.ordOfferInstDto || {}, r?.ordProdInst || {})));
};

const StaffSelectorSearchFormItems = [
  {name: 'lanId', key: 'lanId', value: '', type: 'input', isHidden: !0, col: 9},
  {name: 'prodClass', key: 'prodClass', value: '', type: 'input', isHidden: !0, col: 9},
  // {
  //   type: 'buttons', align: 'left', verticalAlign: 'top', col: 15, items: [
  //     {
  //       btnName: '重置', type: 'button', attrs: {type: ''}, col: 1,
  //       onClick({vm}) {
  //         vm.resetFormData();
  //         tableData.value = [];
  //       }
  //     },
  //     {
  //       btnName: '查询', type: 'button', attrs: {type: 'primary'}, col: 1,
  //       async onClick({vm}) {
  //         getList(1);
  //       }
  //     },
  //   ]
  // }
];

function init() {
  getList(1);
}

</script>
<style lang="scss" scoped>
</style>
