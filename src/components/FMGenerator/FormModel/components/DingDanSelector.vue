<template>
  <div class="DingDanSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button icon="el-icon-search" @click="modelIsShow=!0"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" title="订单查询" width="80%" @opened="init">
      <div class="search-bar">
        <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="StaffSelectorSearchFormItems"></PageSearchPanel>
      </div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="320">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <!--        <el-table-column prop="extCustOrderId" label="合作商订单号" width="120"></el-table-column>-->
        <!--        <el-table-column prop="custOrderId" label="集团订单号" width="120"></el-table-column>-->
        <el-table-column prop="provCustOrderId" label="订单号"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
        <el-table-column prop="channelNbr" label="订单受理渠道"></el-table-column>
        <el-table-column prop="staffCode" label="受理员工编码"></el-table-column>
        <el-table-column prop="acceptDate" label="受理时间" width="160">
          <template #default="{row}">
            {{ $$dateFormatterYMDHMS(row.acceptDate) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" @click="confirm(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      <el-pagination :current-page.sync="pageInfo.offset" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.limit" layout="->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" background @size-change="getList(1)" @current-change="getList()"></el-pagination>-->
    </MDialog>
  </div>
</template>

<script setup>
// 订单查询
import MDialog from '@/components/MDialog';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import {nextTick, getCurrentInstance, onBeforeMount, ref} from "vue";
import {$$formatELDateTimeRange} from "@/utils";

const {proxy} = getCurrentInstance();

const props = defineProps({
  isShow: {type: Boolean, default: false},
  value: {type: String, default: ''},//v-model绑定
  valueKey: {type: String, default: ''},//v-model绑定 所在数据key 如果没有就不进行双向绑定 通过onConfirm自己赋值
  title: {type: String, default: ''},
});

const modelIsShow = ref(false);
const loading = ref(false);
const PageSearchPanelRef = ref();
const pageInfo = ref({offset: 1, limit: 15, rowCount: 0});
const tableData = ref([]);

function confirm(row) {
  props.valueKey && proxy.$emit('input', row[props.valueKey]);
  proxy.$emit('onConfirm', Object.assign({}, row, {
    acceptDate: proxy.$$dateFormatterYMDHMS(row.acceptDate)
  }));
  modelIsShow.value = false;
  console.log(PageSearchPanelRef.value.getFormData())
  tableData.value = []
  pageInfo.value.rowCount = 0;
  pageInfo.value.offset = 1;
}

// 列表请求
const getList = async (offset = pageInfo.value.offset) => {
  // pageInfo.value.offset = offset;
  const formData = PageSearchPanelRef.value.getFormData();
  // const {res, err} = await proxy.$$api.crm.customerOrderList({params: Object.assign({pageInfo: pageInfo.value}, formData)});
  const {res, err} = await proxy.$$api.crm.orderInfo({
    params: Object.assign(formData, proxy.$$formatELDateTimeRange(formData.timeRange, ['beginDate', 'endDate']))
  });
  if (err) return;
  // pageInfo.value.rowCount = Number(res?.pageInfo?.totalCount ?? pageInfo.value.rowCount);
  tableData.value = res?.list || [];
};

const StaffSelectorSearchFormItems = [
  {name: '设备号', key: 'serialNumber', value: '', type: 'input', col: 6},
  {name: '创建时间', key: 'timeRange', value: ['2020-08-01', '2024-08-01'], type: 'dateRangePicker', col: 9},
  {name: 'prodClass', key: 'prodClass', value: '', type: 'input', isHidden: !0},
  {name: 'lanId', key: 'lanId', value: '', type: 'input', isHidden: !0},
  {
    type: 'buttons', align: 'left', verticalAlign: 'top', col: 9, items: [
      {
        btnName: '重置', type: 'button', attrs: {type: ''}, col: 1,
        onClick({vm}) {
          vm.resetFormData();
          tableData.value = [];
          init()
        }
      },
      {
        btnName: '查询', type: 'button', attrs: {type: 'primary'}, col: 1,
        async onClick({vm}) {
          if (!vm.formData.serialNumber) return;
          const {res, err} = await proxy.$$api.crm.getHNumber({params: {segment: vm.formData.serialNumber}});//segment
          if (res?.lanid) {
            vm.formData.lanId = res.lanid;
            return getList(1);
          }
          proxy.$$Toast({message: `查询失败`, type: 'error'});
        }
      },
    ]
  }
];

function init() {
  const customPositioning = proxy.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  PageSearchPanelRef.value.initFormData({
    serialNumber: accNum, prodClass: accType, lanId: lanIdInfo.lanid,
    timeRange: ['2020-08-01', '2024-08-01']
  });
  getList(1);
}

</script>
<style lang="scss" scoped>
.main-container {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
  padding: 1% 5% 0;

  .search-bar {
    width: 100%;
    font-size: 0;
  }

  .btns {
    text-align: right;
  }
}
</style>
