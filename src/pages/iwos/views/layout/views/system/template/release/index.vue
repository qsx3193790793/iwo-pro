<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <div class="table-panel one-screen-fg1">
      <JsTable :dataSource="list" :columns="columns">
        <template #updatedTime="{row}">
          {{ $$dateFormatter(row.updatedTime) }}
        </template>
        <template #workorderType="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('template_work_order_type', row.workorderType) }}
        </template>
        <template #bigType="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('template_big_type', row.bigType) }}
        </template>
        <template #smallType="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('template_small_type', row.smallType) }}
        </template>
      </JsTable>
      <div class="pagination-area">
        <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
      </div>
    </div>
    <AddDialog v-if="isShowAddDialog" v-model="isShowAddDialog" :pkid="select_pkid" destroyOnClose isDetail type="发布" @success="getList(1)"></AddDialog>
    <AddDialog v-if="isShowDetailDialog" v-model="isShowDetailDialog" :pkid="select_pkid" destroyOnClose isDetail type="详情" @success="getList(1)"></AddDialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import JsTable from '@/components/js-table/index.vue';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import AddDialog from '../components/AddDialog';
import {onMounted} from "vue"

const {proxy} = getCurrentInstance();
const isShowDetailDialog = ref(false)
let columns = ref({
  props: [
    {
      name: '工单类型',
      key: 'workorderType',
    },
    {
      name: '模板名称',
      key: 'templateName',
      width: 200
    },
    {
      name: '模板大类',
      key: 'bigType',
    },
    {
      name: '模板小类',
      key: 'smallType',
    },
    {
      name: '描述',
      key: 'templateDesc',
      width: 200
    },
    {
      name: '状态',
      key: 'statusName',
    },
    // {
    //   name: '模板ID',
    //   key: 'templateId',
    // },
    // {
    //   name: '是否应用',
    //   key: '',
    // },
    // {
    //   name: '省',
    //   key: '',
    // },
    {
      name: '更新人',
      key: 'updatedBy',
    },
    {
      name: '更新时间',
      key: 'updatedTime',
      width: 160
    },
  ],
  options: {
    btns: [
      // {
      //   label: '下架',
      //   key: 'down', type: 'danger',
      //   permission: ['system:template:soldOut'],
      //   autoHidden: ({row}) => row.statusName === '上架',
      //   event: (row) => {
      //     proxy.$$Dialog.confirm('确认下架吗？', '提示').then(async () => {
      //       const {res, err} = await proxy.$$api.template.soldOut({data: {versionId: row.versionId, sceneCode: row.sceneCode, templateType: row.bigType, workorderType: row.workorderType, unsanctionedDesc: ''}});
      //       if (err) return;
      //       getList(1);
      //       proxy.$$Toast({message: `操作成功`, type: 'success'});
      //     }).catch(proxy.$$emptyFn);
      //   },
      // },
      {
        label: '发布',
        key: 'release', type: 'warning',
        permission: ['system:template:release'],
        autoHidden: ({row}) => row.statusName === '待发布',
        event: (row) => {
          select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
          isShowAddDialog.value = !0;
        },
      },
      {
       label: '详情',
       key: 'detail', 
       permission: ['system:template:detail'],
       event: (row) => {
         select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
         isShowDetailDialog.value = !0;
       },
      },
    ],
  },
})

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

const list = ref([]);

// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  const formData = PageSearchPanelRef.value.getFormData();
  const {res, err} = await proxy.$$api.template.pendingReleaseList({params: Object.assign(proxy.$$formatELDateTimeRange(formData.timeRange, ['startTime', 'endTime']), pageInfo.value, formData)});
  if (err) return;
  pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
  list.value = res?.rows || [];
};

//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {name: '工单类型', key: 'workorderType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_work_order_type'), isDisable: !1, isRequire: !1},
  {name: '模板名称', key: 'templateName', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '模板大类', key: 'bigType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_big_type'), isDisable: !1, isRequire: !1},
  {name: '模板小类', key: 'smallType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_small_type'), isDisable: !1, isRequire: !1},
  {
    name: '省', key: 'provinceCode', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('base_province_code'), isDisable: !1, isRequire: !1,
    isShow() {
      return proxy.$store.getters['user/GET_USER_PROVINCE_CODE'] === '8100000';//集团账号
    }
  },
  {
    name: '投诉现象', key: 'sceneLevelCode', value: [], col: 6, type: 'cascader', isDisable: !1, isRequire: !0,
    options: ({vm}) =>  proxy.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree'),
  },
  {
    name: '产品', key: 'productCode', value: [], col: 6, type: 'cascader', isDisable: !1, isRequire: !1,
    options: ({vm}) => proxy.$store.getters['dictionaries/GET_DICT']('complaint_product_tree_level_1'),
  },
  {
    name: '投诉来源', key: 'sceneLevelCode', value: [], col: 6, type: 'cascader', isDisable: !1, isRequire: !0,
    options: ({vm}) =>  proxy.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid'),
  },
  {name: '创建时间', key: 'timeRange', value: '', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
  {
    type: 'buttons', align: 'right', verticalAlign: 'top', col: proxy.$store.getters['user/GET_USER_PROVINCE_CODE'] === '8100000' ? 12 : 18, items: [
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
]);

//投诉现象下拉菜单
async function listComplaintPhenomenonTree() {
  if (proxy.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree')?.length) return;
  const {res, err} = await proxy.$$api.complaintPhenomenon.listComplaintPhenomenonTree({params: {status: 1}});
  if (err) return;
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_phenomenon_tree: proxy.$$formatCascaderTree((res?.phenomList || []).map(r => (r.phenomList = null, r)), 'phenomName', 'phenomCode', 'phenomList')});
}
//产品下拉菜单
async function listProductTree() {
  if (proxy.$store.getters['dictionaries/GET_DICT']('complaint_product_tree_level_1')?.length) return;
  const {res, err} = await proxy.$$api.productClassification.listProductTree({params: {status: 1}});
  if (err) return;
  // 只需要一级即可
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_product_tree_level_1: proxy.$$formatCascaderTree((res?.list || []).map(r => (r.children = null, r)), 'productName', 'productCode', 'children')});
}
//投诉来源下拉菜单
async function listComplaintSourceTree() {
  const {res, err} = await proxy.$$api.complaintSource.listComplaintSourceTree({data: {status: 1}});
  if (err) return;
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_source_tree_by_uid: proxy.$$formatCascaderTree((res?.list || []).map(r => (r.children = null, r)), 'sourceName', 'sourceCode', 'children')});
}
onMounted(() => {
  getList(1)
  listComplaintPhenomenonTree()
  listProductTree()
  listComplaintSourceTree()
})


</script>
<script>
export default {
  name: 'ReleaseIndex',
  dicts: ['template_work_order_type', 'template_status_name', 'template_big_type', 'template_small_type', 'base_province_code']
}
</script>
<style lang="scss" scoped>
</style>
