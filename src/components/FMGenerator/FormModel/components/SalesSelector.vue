<template>
  <div class="SalesSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button v-if="!root.vm.disabled" icon="el-icon-search" @click="modelIsShow=!0"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" title="销售品查询" width="86%" @opened="init">
      <div class="search-bar">
        <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="StaffSelectorSearchFormItems"></PageSearchPanel>
      </div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="320">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="offerNbr" label="销售品编号" width="220"></el-table-column>
        <el-table-column prop="custName" label="客户姓名"></el-table-column>
        <el-table-column prop="offerName" label="销售品名称"></el-table-column>
        <el-table-column prop="offerTypeName" label="销售品类型"></el-table-column>
        <el-table-column prop="beginDate" label="开通时间" width="160"></el-table-column>
        <el-table-column prop="effDate" label="生效时间" width="160"></el-table-column>
        <el-table-column prop="expDate" label="失效时间" width="160"></el-table-column>
        <el-table-column prop="statusCdName" label="状态" width="100"></el-table-column>
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
  console.log(PageSearchPanelRef.value.getFormData())
  tableData.value = []
  // pageInfo.value.rowCount = 0;
  // pageInfo.value.offset = 1;
}

// 列表请求
const getList = async () => {
  const formData = PageSearchPanelRef.value.getFormData();
  const {res, err} = await proxy.$$api.crm.getpromInfo({
    data: formData,
    headers: {'complaintWorksheetId': formData.complaintWorksheetId ?? '', 'complaintAssetNum': formData.accNum ?? ''}
  });
  if (err) return;
  tableData.value = res?.dataList || [];
};

const StaffSelectorSearchFormItems = [
  {name: '设备号', key: 'accNum', value: '', type: 'input', col: 9},
  {name: 'lanId', key: 'lanId', value: '', type: 'input', isHidden: !0, col: 9},
  {name: 'prodClass', key: 'prodClass', value: '', type: 'input', isHidden: !0, col: 9},
  {name: 'complaintWorksheetId', key: 'complaintWorksheetId', value: '', type: 'input', isHidden: !0, col: 9},
  {
    type: 'buttons', align: 'left', verticalAlign: 'top', col: 15, items: [
      {
        btnName: '重置', type: 'button', attrs: {type: ''}, col: 1,
        onClick({vm}) {
          vm.resetFormData();
          tableData.value = [];
          init();
        }
      },
      {
        btnName: '查询', type: 'button', attrs: {type: 'primary'}, col: 1,
        async onClick({vm}) {
          if (!vm.formData.accNum) return;
          const {res, err} = await proxy.$$api.crm.getHNumber({
            params: {segment: vm.formData.accNum},
            headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': vm.formData.accNum ?? ''}
          });//segment
          vm.formData.lanId = res?.lanid || proxy.$store.getters['user/GET_USER_PROVINCE_CODE'];
          getList(1);
        }
      },
    ]
  }
];

function init() {
  const customPositioning = proxy.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  if (!customPositioning) return;
  const {lanIdInfo, complaintWorksheetId, accType, accNum} = customPositioning;
  PageSearchPanelRef.value.initFormData({
    accNum, lanId: lanIdInfo.lanid, prodClass: accType, complaintWorksheetId
  });
  getList(1);
}

</script>
<style lang="scss" scoped>
</style>
