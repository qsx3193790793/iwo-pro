<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <div class="table-panel one-screen-fg1">
      <!--        <JsTable :dataSource="list" :columns="columns" @selectionChange="selectionChange">-->
      <JsTable :dataSource="list" :columns="columns">
        <template #updatedTime="{row}">
          {{ $$dateFormatter(row.updatedTime) }}
        </template>
        <template #workorderType="{row}">
          {{ proxy.$store.getters['dictionaries/MATCH_LABEL']('template_work_order_type', row.workorderType) }}
        </template>
        <template #bigType="{row}">
          {{ proxy.$store.getters['dictionaries/MATCH_LABEL']('template_big_type', row.bigType) }}
        </template>
        <template #smallType="{row}">
          {{ proxy.$store.getters['dictionaries/MATCH_LABEL']('template_small_type', row.smallType) }}
        </template>
      </JsTable>
      <div class="pagination-area">
        <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize" :page-sizes="[1,15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
      </div>
    </div>
    <AddDialog v-if="isShowAddDialog" v-model="isShowAddDialog" :pkid="select_pkid" destroyOnClose @success="getList(1)"></AddDialog>
    <FormView v-if="isShowFormViewDialog" v-model="isShowFormViewDialog" :pkid="select_pkid" destroyOnClose></FormView>
    <AddDialog v-if="isShowReleaseDialog" v-model="isShowReleaseDialog" :pkid="select_pkid" destroyOnClose isDetail type="发布" @success="getList(1)"></AddDialog>
    <AddDialog v-if="isShowAuditDialog" v-model="isShowAuditDialog" :pkid="select_pkid" destroyOnClose isDetail type="审核" @success="getList(1)"></AddDialog>
    <AddDialog v-if="isShowDetailDialog" v-model="isShowDetailDialog" :pkid="select_pkid" destroyOnClose isDetail type="详情" @success="getList(1)"></AddDialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import JsTable from '@/components/js-table/index.vue';
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import AddDialog from '../components/AddDialog';
import FormView from '../components/FormView';
import {onMounted} from "vue"

const {proxy} = getCurrentInstance();

const props = defineProps({
  isQuote: {type: Boolean, default: false},//引用模式 从设计器中弹窗显示
});

const isShowReleaseDialog = ref(false);
const isShowAuditDialog = ref(false);
const isShowFormViewDialog = ref(false);
const isShowDetailDialog = ref(false)
let columns = ref({
  props: [
    {
      name: '工单类型',
      key: 'workorderType',
    },
    {
      name: '产品',
      key: 'productName',
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
    {
      name: '驳回/回退原因',
      key: 'unsanctionedDesc',
      width: 140
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
// 草稿：提交审核、编辑、设计、预览、删除
// 驳回：编辑、设计、预览、删除
// 回退：编辑、设计、预览、删除
// 下架：编辑、设计、预览、删除
// 待审核：审核、预览
// 待发布：发布、预览
// 上架：下架、复制、预览
  options: {
    btns: props.isQuote
        ? [{
          label: '复用',
          key: 'quote',
          event: (row) => {
            proxy.$$Dialog.confirm('复用模板将清空已配置数据，是否复用？', '提示', {
              confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
            }).then(async () => {
              const {res, err} = await proxy.$$api.template.detail({templateId: row.templateId, versionId: row.versionId});
              if (res) return proxy.$emit('onQuote', res);
              proxy.$$Toast({message: `操作失败`, type: 'error'});
            }).catch(proxy.$$emptyFn);
          },
        }, {
          label: '预览',
          key: 'view',
          event: row => {
            select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
            isShowFormViewDialog.value = !0;
          },
        }]
        : [
          {
            label: '修改',
            autoHidden: ({row}) => !['待审核', '待发布', '上架', '下架'].includes(row.statusName),
            key: 'edit',
            permission: ['system:template:detail'],
            event: (row) => {
              select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
              isShowAddDialog.value = !0;
            },
          },
          {
            label: '升级',
            autoHidden: ({row}) => ['上架', '下架'].includes(row.statusName),
            permission: ['system:template:detail'],
            type: 'warning',
            key: 'copy',
            event: (row) => {
              select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
              isShowAddDialog.value = !0;
            },
          },
          {
            label: '预览',
            key: 'view',
            event: row => {
              select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
              isShowFormViewDialog.value = !0;
            },
          },
          {
            label: '更多',
            key: 'more',
            permission: ['system:template:apply', 'system:template:approval', 'system:template:soldOut', 'system:template:release', 'system:template:update', 'system:template:delete'],
            children: [
              {
                label: '提交审核',
                key: 'audit', type: 'warning',
                permission: ['system:template:apply'],
                autoHidden: ({row}) => row.statusName === '草稿',
                event: (row) => {
                  proxy.$$Dialog.confirm('确认提交审核吗？', '提示').then(async () => {
                    const {res, err} = await proxy.$$api.template.apply({versionId: row.versionId});
                    if (err) return;
                    getList(1);
                    proxy.$$Toast({message: `操作成功`, type: 'success'});
                  }).catch(proxy.$$emptyFn);
                },
              },
              {
                label: '审核',
                key: 'audit', type: 'warning',
                permission: ['system:template:approval'],
                autoHidden: ({row}) => row.statusName === '待审核',
                event: (row) => {
                  select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
                  isShowAuditDialog.value = !0;
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
              // {
              //   label: '下架',
              //   key: 'down', type: 'warning',
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
                  isShowReleaseDialog.value = !0;
                },
              },
              {
                label: '设计',
                key: 'designer',
                type: 'success',
                permission: ['system:template:update'],
                autoHidden: ({row}) => ['草稿', '驳回', '回退'].includes(row.statusName),
                event: row => {
                  console.log(row);
                  proxy.$router.push({name: 'TemplateDesigner', params: {templateId: row.templateId, versionId: row.versionId}})
                },
              },
              {
                label: '删除',
                key: 'del',
                type: 'danger',
                permission: ['system:template:delete'],
                autoHidden: ({row}) => ['草稿', '驳回', '回退'].includes(row.statusName),
                event: handleDel,
              },
            ]
          }],
  },
})

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

const list = ref([]);

// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  const formData = PageSearchPanelRef.value.getFormData();
  const sceneCode = [
    formData.phenomenonCode?.[2] || formData.phenomenonCode?.[1] || formData.phenomenonCode?.[0],
    formData.productCode?.[0],
    formData.complaintSourceCode?.[2] || formData.complaintSourceCode?.[1] || formData.complaintSourceCode?.[0],
  ].filter(v => !!v).join(':');
  const {res, err} = await proxy.$$api.template.list({params: Object.assign(proxy.$$formatELDateTimeRange(formData.timeRange, ['startTime', 'endTime']), pageInfo.value, formData, {sceneCode: sceneCode})});
  console.log('sceneCode', sceneCode);
  if (err) return;
  pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
  list.value = res?.rows || [];
};

//列表选择
// const selectionList = ref([]);
//
// function selectionChange(value) {
//   selectionList.value = value.map(v => v.versionId);
// }

function handleDel(row) {
  proxy.$$Dialog.confirm('确认删除记录吗？', '提示').then(async () => {
    const {res, err} = await proxy.$$api.template.delete({versionIds: row ? row.versionId : selectionList.value});
    if (err) return;
    // selectionList.value = [];
    getList(1);
    proxy.$$Toast({message: `删除成功`, type: 'success'});
  }).catch(proxy.$$emptyFn);
}

//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {name: '工单类型', key: 'workorderType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_work_order_type'), isDisable: !1, isRequire: !1},
  {name: '模板名称', key: 'templateName', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '模板大类', key: 'bigType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_big_type'), isDisable: !1, isRequire: !1},
  {
    name: '模板小类', key: 'smallType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_small_type'), isDisable: !1, isRequire: !1,
    onChange({vm}) {
      vm.formData.phenomenonCode = ''
      vm.formData.productCode = ''
      vm.formData.complaintSourceCode = ''
    },
  },
  {
    name: '投诉现象', key: 'phenomenonCode', value: [], col: 6, type: 'cascader', isDisable: ({vm}) => !(vm.formData.smallType === 'TPL0100'), isRequire: !1,
    options: ({vm}) => proxy.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree'),
  },
  {
    name: '产品', key: 'productCode', value: [], col: 6, type: 'cascader', isDisable: ({vm}) => !(vm.formData.smallType === 'TPL0100'), isRequire: !1,
    options: ({vm}) => proxy.$store.getters['dictionaries/GET_DICT']('complaint_product_tree_level_1'),
  },
  {
    name: '投诉来源', key: 'complaintSourceCode', value: [], col: 6, type: 'cascader', isDisable: ({vm}) => !(vm.formData.smallType === 'TPL0101'), isRequire: !1,
    options: ({vm}) => proxy.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid'),
  },
  {name: '状态', key: 'statusName', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_status_name'), isDisable: !1, isRequire: !1},
  {
    name: '省', key: 'provinceCode', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('base_province_code'), isDisable: !1, isRequire: !1,
    isShow: () => proxy.$store.getters['user/GET_USER_PROVINCE_CODE'] === '8100000'
  },
  {name: '创建时间', key: 'timeRange', value: '', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
  {col: 6, type: 'divider-empty'},
  {col: 6, type: 'divider-empty', isShow: () => proxy.$store.getters['user/GET_USER_PROVINCE_CODE'] !== '8100000'},
  {
    type: 'buttons', align: 'right', verticalAlign: 'top', col: 6, permission: ['system:template:create'], items: [
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
      {
        btnName: '新增', type: 'button', attrs: {type: 'success'}, col: 1,
        permission: ['system:template:create'],
        isShow() {
          return !props.isQuote
        },
        onClick({vm}) {
          // 打开弹窗
          select_pkid.value = null;
          isShowAddDialog.value = !0;
        }
      },
      {
        btnName: '初始化', type: 'button', attrs: {type: 'danger'}, col: 1,
        isShow({vm}) {
          return proxy.$store.getters['user/IS_ADMIN'];
        },
        onClick({vm}) {
          proxy.$$Dialog.confirm('确认初始化吗？', '提示').then(async () => {
            const {res, err} = await proxy.$$api.template.initTemplate({});
            if (res) return proxy.$$Toast({message: `操作成功`, type: 'success'});
            proxy.$$Toast({message: `操作失败`, type: 'error'});
          }).catch(proxy.$$emptyFn);
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
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_phenomenon_tree: proxy.$$formatCascaderTree(res?.phenomList || [], 'phenomName', 'phenomCode', 'phenomList')});
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
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_source_tree_by_uid: proxy.$$formatCascaderTree(res?.list || [], 'sourceName', 'sourceCode', 'children')});
}

onMounted(() => {
  getList(1)
  listComplaintPhenomenonTree();
  listProductTree()
  listComplaintSourceTree()
  console.log('TemplateIndex onMounted')
})


</script>
<script>
export default {
  name: 'TemplateIndex',
  dicts: ['template_work_order_type', 'template_status_name', 'template_big_type', 'template_small_type', 'base_province_code']
}
</script>
<style lang="scss" scoped>
</style>
