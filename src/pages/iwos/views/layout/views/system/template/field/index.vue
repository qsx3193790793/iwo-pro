<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable :dataSource="list" :columns="columns" @selectionChange="selectionChange">
          <template #updatedTime="{row}">
            {{ $$dateFormatter(row.updatedTime) }}
          </template>
          <template #type="{row}">
            {{ $store.getters['dictionaries/MATCH_LABEL']('template_field_type', row.type) }}
          </template>
          <template #isProvinceCustom="{row}">
            {{ $store.getters['dictionaries/MATCH_LABEL']('yes_no', row.isProvinceCustom) }}
          </template>
          <template #provinceCode="{row}">
            {{ $store.getters['dictionaries/MATCH_LABEL']('base_province_code', row.provinceCode) }}
          </template>
        </JsTable>
        <div class="pagination-area">
          <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
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

let columns = ref({
  selection: true,
  props: [
    {
      name: '字段类型',
      key: 'type',
    },
    {
      name: '字段标题',
      key: 'title',
    },
    {
      name: '字段名称',
      key: 'name',
    },
    {
      name: '字段描述',
      key: 'comment',
    },
    {
      name: '是否自定义',
      key: 'isProvinceCustom',
    },
    {
      name: '省',
      key: 'provinceCode',
    },
    {
      name: '更新人',
      key: 'updatedBy',
    },
    {
      name: '更新时间',
      key: 'updatedTime',
    },
  ],
  options: {
    btns: [
      {
        label: '修改',
        key: 'edit',
        autoHidden: ({row}) => row.isProvinceCustom == '1',
        event: row => {
          console.log(row);
          // 打开编辑弹窗
          select_pkid.value = row?.fieldId;
          isShowAddDialog.value = true;
        },
      },
      {
        label: '删除',
        key: 'del',
        type: 'danger',
        autoHidden: ({row}) => row.isProvinceCustom == '1',
        event: handleDel,
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
  const {res, err} = await proxy.$$api.modelFields.list({params: Object.assign({}, pageInfo.value, PageSearchPanelRef.value.getFormData())});
  if (err) return;
  pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
  list.value = res?.rows || [];
  pageInfo.rowCount = res.total;
};

//列表选择
const selectionList = ref([]);

function selectionChange(value) {
  selectionList.value = value.map(v => v.fieldId);
}

function handleDel(row) {
  proxy.$$Dialog.confirm('确认删除记录吗？', '提示').then(async () => {
    const {res, err} = await proxy.$$api.modelFields.delTFieldConfig({fieldIds: row ? row.fieldId : selectionList.value});
    if (err) return;
    selectionList.value = [];
    getList(1);
    proxy.$$Toast({message: `删除成功`, type: 'success'});
  }).catch(proxy.$$emptyFn);
}

//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {name: '字段类型', key: 'type', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_field_type'), isDisable: !1, isRequire: !1},
  {name: '字段标题', key: 'title', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '字段名称', key: 'name', value: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {
    type: 'buttons', align: 'right', verticalAlign: 'top', col: 6, items: [
      {
        btnName: '重置', type: 'button', attrs: {type: ''}, col: 1,
        onClick({vm}) {
          vm.resetFormData();
          getList(1)
        }
      },
      {
        btnName: '查询', type: 'button', attrs: {type: 'primary'}, col: 1,
        onClick({vm}) {
          getList(1)
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
      {
        btnName: '删除', type: 'button', attrs: {type: 'danger', disabled: () => !selectionList.value.length}, col: 1,
        onClick({vm}) {
          handleDel();
        }
      },
    ]
  }
]);

onMounted(() => {
  // proxy.$$api.modelFields.lists({params: {name: 'example'}});
  // proxy.$$api.modelFields.getListByIds({data: []});
  getList(1)
})


</script>
<script>
export default {
  name: 'FieldIndex',
  cusDicts: ['template_field_type', 'yes_no', 'base_province_code']
}
</script>
<style lang="scss" scoped>
</style>
