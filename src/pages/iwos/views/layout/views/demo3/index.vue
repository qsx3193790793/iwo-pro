<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable :dataSource="list" :columns="columns">
          <template #ordernumber="{row}">
            <div style="color: rgb(50, 151, 255);cursor: pointer;" @click="Todetail(row)">{{ row.ordernumber }}</div>
          </template>
          <!-- <template #state="scope">
            {{ scope.row.state == 0 ? '激活' : '未激活' }}
          </template> -->
        </JsTable>
        <div class="pagination-area">
          <el-pagination :current-page.sync="pageInfo.pageNo" :page-size.sync="pageInfo.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
        </div>
      </div>
    </template>
    <el-empty v-else></el-empty>
    <AddDialog v-if="isShowAddDialog" v-model="isShowAddDialog" :pkid="select_pkid" destroyOnClose @success="getList(1)"></AddDialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import JsTable from '@/components/js-table/index.vue';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import AddDialog from './components/AddDialog';
import {onMounted} from "vue"

const {proxy} = getCurrentInstance();
const Todetail = (row) => {
  console.log(row)
}
let columns = ref({
  selection: true,
  props: [
    {
      name: '工单类型',
      key: 'ordernumber',
    },
    {
      name: '模板名称',
      key: 'complaintNumber',
    },
    {
      name: '模板大类',
      key: 'complaintNumber',
    },
    {
      name: '模板小类',
      key: 'phone',
    },
    {
      name: '描述',
      key: 'orderStatus',
    },
    {
      name: '状态',
      key: 'orderType',
    },
    {
      name: '模板ID',
      key: 'phenomenon',
    },
    {
      name: '是否应用',
      key: 'acceptanceContent',
    },
    {
      name: '省',
      key: 'closingContent',
    },
    {
      name: '更新人',
      key: 'closingContent',
    },
    {
      name: '更新时间',
      key: 'createTime',
    },
  ],
  options: {
    btns: [
      {
        label: '编辑',
        key: 'edit',
        event: null,
      },
      {
        label: '设计',
        key: 'designer',
        type: 'success',
        event: row => {
          console.log(row);
          //路由跳转
          proxy.$router.push({name: 'TemplateDesigner'})
        },
      },
      {
        label: '预览',
        key: 'view',
        event: null,
      },
      {
        label: '删除',
        key: 'del',
        type: 'danger',
        event: null,
      },
    ],
  },
})

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNo: 1, pageSize: 15, rowCount: 1000});

const list = ref([]);

// 列表请求
const getList = async (pageNo = pageInfo.value.pageNo) => {
  pageInfo.value.pageNo = pageNo;
  const {res} = await proxy.$$api.dept.listDept({data: Object.assign({}, pageInfo.value, PageSearchPanelRef.value.getFormData())});
  if (res) {
    pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
    // list.value = res?.records || [];
  }
};

//列表选择
const selectionList = ref([]);

//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {name: '日期1', key: 'ce', value: '18:18:18', col: 6, type: 'timePicker', isDisable: !1, isRequire: !1},
  {name: '日期2', key: 'ce2', value: null, col: 6, type: 'timeRangePicker', isDisable: !1, isRequire: !1},
  {name: '工单类型', key: 'ordernumber', value: '', col: 6, type: 'select', isDisable: !1, isRequire: !1},
  {name: '模板名称', key: 'complaintNumber', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '模板大类', key: 'D', value: '否', col: 6, type: 'select', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !1},
  {name: '模板小类', key: 'E', value: '否', col: 6, type: 'select', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !1},
  {name: '状态', key: 'F', value: '否', col: 6, type: 'select', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !1},
  {name: '省', key: 'G', value: '是', col: 6, type: 'select', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !1},
  {name: '创建时间', key: 'LLL', value: '否', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
  {name: '创建时间2', key: 'LLL2', value: '否', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
  {name: '创建时间3', key: 'LLL3', value: '否', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
  {name: '创建时间4', key: 'LLL4', value: '否', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
  {col: 6, type: 'divider-empty'},
  {
    type: 'buttons', align: 'right', verticalAlign: 'top', col: 6, items: [
      {
        btnName: '重置', type: 'button', attrs: {type: ''}, col: 1,
        onClick({vm}) {
          vm.resetFormData();
        }
      },
      {
        btnName: '查询', type: 'button', attrs: {type: 'primary'}, col: 1,
        onClick({vm}) {
          console.log(vm)
        }
      },
      {
        btnName: '删除', type: 'button', attrs: {type: 'danger'}, col: 1,
        onClick({vm}) {
          console.log(vm)
        }
      },
      {
        btnName: '新增', type: 'button', attrs: {type: 'success'}, col: 1,
        onClick({vm}) {
          // 打开弹窗
          select_pkid.value = null;
          isShowAddDialog.value = !0;
        }
      },
    ]
  }
]);

onMounted(() => {
  list.value = Array.from({length: 55}).map((v, i) => ({
    id: i,
    ordernumber: 'TS202600025205',
    createTime: '1',
    complaintNumber: '水电费',
    name: '水电费',
    date: '水电费',
    c: '水电费',
    d: '水电费',
    phone: '1',
    orderStatus: '1',
    orderType: '1',
    phenomenon: '1',
    acceptanceContent: '1',
    closingContent: '1',
  }))
})


</script>
<script>
export default {name: 'TemplateIndex'}
</script>
<style lang="scss" scoped>
::v-deep(.ve-table) {
  height: 100%;
}
</style>
