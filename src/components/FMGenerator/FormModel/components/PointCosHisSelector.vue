<template>
  <div class="PaymentSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button icon="el-icon-search" @click="modelIsShow=!0"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" title="积分消费历史查询" width="86%" @opened="init">
      <div class="search-bar">
        <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="StaffSelectorSearchFormItems"></PageSearchPanel>
      </div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="320">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="exchangeID" label="兑换流水号" width="160"></el-table-column>
        <el-table-column prop="point" label="消费数额"></el-table-column>
        <el-table-column prop="pointCosumeTime" label="消费时间" width="160">
          <template #default="{row}">
            {{ $$dateFormatterYMDHMS(row.pointCosumeTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="商家名称" width="200"></el-table-column>
        <el-table-column prop="giftAmount" label="礼品的数量"></el-table-column>
        <el-table-column prop="giftDes" label="礼品描述" width="420"></el-table-column>
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
import MDialog from '@/components/MDialog';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import {nextTick, getCurrentInstance, onBeforeMount, ref} from "vue";
import {$$dateFormatter} from "@/utils";

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
const tableData = ref([]);

function confirm(row) {
  props.valueKey && proxy.$emit('input', row[props.valueKey]);
  proxy.$emit('onConfirm', Object.assign({}, row, {
    pointCosumeTime: proxy.$$dateFormatterYMDHMS(row.pointCosumeTime)
  }));
  modelIsShow.value = false;
  console.log(PageSearchPanelRef.value.getFormData())
  tableData.value = []
  // pageInfo.value.rowCount = 0;
  // pageInfo.value.offset = 1;
}

// 列表请求
const getList = async () => {
  const formData = PageSearchPanelRef.value.getFormData();
  const [startDate, endDate] = formData.timeRange || [];
  const {res, err} = await proxy.$$api.crm.qryPointCosHis({
    params: Object.assign({startDate, endDate}, formData)
  });
  if (err) return;
  tableData.value = res?.list;
};

const StaffSelectorSearchFormItems = [
  {name: '设备号', key: 'accNum', value: '', type: 'input', col: 6},
  {name: '周期', key: 'timeRange', value: [], type: 'dateRangePicker', col: 8},
  {name: 'prodClass', key: 'prodClass', value: '', type: 'input', isHidden: !0, col: 9},
  {name: 'lanId', key: 'lanId', value: '', type: 'input', isHidden: !0, col: 9},
  {
    type: 'buttons', align: 'left', verticalAlign: 'top', col: 10, items: [
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
          const {res, err} = await proxy.$$api.crm.getHNumber({params: {segment: vm.formData.accNum}});//segment
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
  const end = proxy.$$dateFormatter(proxy.$$dayjs(), 'YYYY-MM-DD')
  const start = proxy.$$dateFormatter(proxy.$$dayjs(end).subtract(6, 'month'), 'YYYY-MM-DD')
  PageSearchPanelRef.value.initFormData({
    accNum, prodClass: accType, lanId: lanIdInfo.lanid,
    timeRange: [start, end]
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
