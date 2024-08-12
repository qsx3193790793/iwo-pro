<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable :dataSource="list" :columns="columns" @selectionChange="handleSelectionChange">
          <template #status="{row}">
            <el-switch  v-model="row.status" :inactive-value="0" :active-value="1"  @change="handleStatusChange(row)"></el-switch>
          </template>
        </JsTable>
        <div class="pagination-area">
          <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize" :page-sizes="[1,15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
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
import AddDialog from '../components/AddDialog';
import {onMounted} from "vue"
const {proxy} = getCurrentInstance();

let columns = ref({
  selection: true,
  props: [
    // {
    //   name: '主键',
    //   key: 'interfaceId',
    // },
    {
      name: '接口编码',
      key: 'interfaceCode',
      width: 200
    },
    {
      name: '接口名称',
      key: 'interfaceName',
    },
    {
      name: '接口地址',
      key: 'interfaceUrl',
    },
    // {
    //   name: '业务入参List',
    //   key: 'requestParam',
    //   width: 200
    // },
    // {
    //   name: '业务出参List',
    //   key: 'responseParam',
    // },
    {
      name: '接口描述',
      key: 'interfaceDesc',
    },
    {
      name: '请求方式',
      key: 'interfaceMethod',
    },
    {
      name: '接口规范类型',
      key: 'interfaceNormType',
    },
    {
      name: '接口类型',
      key: 'interfaceType',
    },
    {
      name: '接口联系信息',
      key: 'interfaceInfo',
    },
    {
      name: '省编码',
      key: 'provinceCode',
    },
    {
      name: '创建人',
      key: 'createdBy',
    },
    {
      name: '创建时间',
      key: 'createdTime',
    },
    {
      name: '更新人',
      key: 'updatedBy',
    },
    {
      name: '状态',
      key: 'status',
    }
  ],
  options: {
    btns:   [{
          label: '编辑',
          // autoHidden: ({row}) => !['待审核', '待发布', '上架'].includes(row.statusName),
          key: 'edit',
          event: (row) => {
            select_pkid.value = {interfaceId: row.interfaceId};
            isShowAddDialog.value = !0;
          },
        },
      ],
  },
})

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

const list = ref([]);
const selectionList=ref([])
// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  const formData = PageSearchPanelRef.value.getFormData();
  const {res, err} = await proxy.$$api.interface.list({params: Object.assign(proxy.$$formatELDateTimeRange(formData.timeRange, ['startTime', 'endTime']), pageInfo.value, formData)});
  if (err) return;
  pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
  list.value = res?.rows || [];
};
function handleSelectionChange(value){
  selectionList.value=value
}
function handleDel(row) {
  proxy.$$Dialog.confirm('确认删除选中的数据吗？', '提示').then(async () => {
    const interfaceIds= selectionList.value.map(item=>{
      return item.interfaceId
    }).join(',')
    const {res, err} = await proxy.$$api.interface.delete({data:{status:2},interfaceIds});
    if (err) return;
    getList(1);
    proxy.$$Toast({message: `删除成功`, type: 'success'});
  }).catch(proxy.$$emptyFn);
}
function handleStatusChange(row){
  let text = row.status === 1 ? "启用" : "停用";
      proxy.$$Dialog.confirm('确认要"' + text + '""' + row.interfaceName + '"接口吗？').then(() => {
        return proxy.$$api.interface.changeStatus({data:{status:row.status,interfaceId:row.interfaceId}});
      }).then(({res, err}) => {
        if (err)  return ; 
        proxy.$$Toast.success(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
}
//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  // {name: '主键', key: 'interfaceId', value: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '接口编码', key: 'interfaceCode', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '接口名称', key: 'interfaceName', value: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  // {name: '接口地址', key: 'interfaceUrl', value: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '请求方式', key: 'interfaceMethod', value: '', col: 6, type: 'select', options: [{label:'GET',value:'GET'},{label:'POST',value:'POST'}], isDisable: !1, isRequire: !1},
  {name: '接口规范类型', key: 'interfaceNormType', value: '', col: 6, type: 'select', options:[{label:'CRM一致性接口',value: 1},{label:'计费一致性接口',value: 2},{label:'省内统一接口',value: 3}], isDisable: !1, isRequire: !1},
  {name: '接口类型', key: 'interfaceType', value: '', col: 6, type: 'select', options: [{label:'统一接口',value: 1},{label:'省内自定义',value: 2}], isDisable: !1, isRequire: !1},
  {name: '接口联系信息', key: 'interfaceInfo', value: '', col: 6, type: 'input',  isDisable: !1, isRequire: !1},
  // {name: '省编码', key: 'provinceCode', value: '', col: 6, type: 'input',isDisable: !1, isRequire: !1},
  {name: '状态', key: 'status', value: '', col: 6, type: 'select', options: [{label:'删除',value:'2'},{label:'启用',value:'1'},{label:'停用',value:'0'}], isDisable: !1, isRequire: !1},
  {
    type: 'buttons', align: 'right', verticalAlign: 'top', col: 6, items: [
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
        btnName: '删除', type: 'button', attrs: {type: 'danger', disabled: () => !selectionList.value.length}, col: 1,
        onClick({vm}) {
          handleDel();
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
  getList(1)
})


</script>
<script>
export default {
  name: 'InterfaceIndex',
  cusDicts: []
}
</script>
<style lang="scss" scoped>
</style>
