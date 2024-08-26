<template>
  <div class="AddressSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button v-if="!root.vm.disabled" icon="el-icon-search" @click="modelIsShow=!0"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" title="选择地址" width="80%">
      <div class="search-bar">
        <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="StaffSelectorSearchFormItems"></PageSearchPanel>
      </div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="320">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="address" label="地址" width="450"></el-table-column>
        <el-table-column prop="lng" label="经度"></el-table-column>
        <el-table-column prop="lat" label="纬度"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" @click="confirm(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page.sync="pageInfo.page" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.rows" layout="->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" background @size-change="getList(1)" @current-change="getList()"></el-pagination>
    </MDialog>
  </div>
</template>

<script setup>
// 订单查询
import MDialog from '@/components/MDialog';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import debounce from "@/plugins/debounce.js";
import {computed, getCurrentInstance, ref} from "vue";

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
const pageInfo = ref({page: 1, rows: 10, rowCount: 0});
const tableData = ref([]);

function confirm(row) {
  props.valueKey && proxy.$emit('input', row[props.valueKey]);
  proxy.$emit('onConfirm', row);
  modelIsShow.value = false;
  console.log(PageSearchPanelRef.value.getFormData())
  tableData.value = []
  pageInfo.value.rowCount = 0;
  pageInfo.value.page = 1;
}

// 列表请求
const getList = async (page = pageInfo.value.page) => {
  const customPositioning = proxy.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  const {complaintWorksheetId, accNum} = customPositioning;
  pageInfo.value.page = page;
  const formData = PageSearchPanelRef.value.getFormData();
  const {res, err} = await proxy.$$api.crm.getGisAddressList({
    params: Object.assign({page: pageInfo.value.page - 1, rows: pageInfo.value.rows}, formData),
    headers: {'complaintWorksheetId': complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  if (err) return;
  pageInfo.value.rowCount = Number(res?.records ?? pageInfo.value.rowCount);
  tableData.value = res?.rows || [];
};

const StaffSelectorSearchFormItems = [
  {name: '关键词', key: 'keyWord', value: '', type: 'input', col: 12},
  {
    type: 'buttons', align: 'left', verticalAlign: 'top', col: 12, items: [
      {
        btnName: '重置', type: 'button', attrs: {type: ''}, col: 1,
        onClick({vm}) {
          vm.resetFormData();
          getList(1);
        }
      },
      {
        btnName: '查询', type: 'button', attrs: {type: 'primary'}, col: 1,
        onClick({vm}) {
          getList(1);
        }
      },
    ]
  }
]

</script>
<style lang="scss" scoped>
</style>
