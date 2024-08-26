<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable :dataSource="list" :columns="columns" @selectionChange="handleSelectionChange">
          <template #interfaceMethod="{row}">
            {{ proxy.$store.getters['dictionaries/MATCH_LABEL']('interface_request_method', row.interfaceMethod) }}
          </template>
          <template #interfaceNormType="{row}">
            {{ proxy.$store.getters['dictionaries/MATCH_LABEL']('interface_specification_type', row.interfaceNormType) }}
          </template>
          <template #interfaceType="{row}">
            {{ proxy.$store.getters['dictionaries/MATCH_LABEL']('interface_type', row.interfaceType) }}
          </template>
          <template #status="{row}">
            <el-tag :type="row.status == 0?'danger':''">
              {{ $store.getters['dictionaries/MATCH_LABEL']('start_stop', row.status) }}
            </el-tag>
            <!-- <el-switch v-model="row.status" :inactive-value="0" :active-value="1" @change="handleStatusChange(row)"></el-switch> -->
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

const props = defineProps({
  type: {type: String, default: null},//打开类型 默认普通 ，FormModel=表单打开
});

let columns = ref({
  selection: true,
  props: [
    {
      name: '接口编码',
      key: 'interfaceCode',

    },
    {
      name: '接口名称',
      key: 'interfaceName',
    },
    {
      name: '接口地址',
      key: 'interfaceUrl',
    },
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
      width: 160
    },
    {
      name: '接口类型',
      key: 'interfaceType',
    },
    {
      name: '接口联系信息',
      key: 'interfaceInfo',
      width: 120
    },
    {
      name: '省份',
      key: 'provinceName',
    },
    {
      name: '创建人',
      key: 'createdBy',
    },
    {
      name: '创建时间',
      key: 'createdTime',
      width: 160
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
    btns: props.type === 'FormModel' ? [{
      label: '选择', event: (row) => {
        proxy.$emit('onSelect', row);
      }
    }] : [
      {
      label: '编辑',
      key: 'edit',
      event: (row) => {
        select_pkid.value = {interfaceId: row.interfaceId};
        isShowAddDialog.value = !0;
      },
     },
     {
       label: "启用",
       key: "start",
       type: "primary",
       autoHidden: autoStartHidden,
       event: handleStart,
        },
      {
       label: "停用",
       key: "end",
       type: "danger",
       autoHidden:autoEndHidden,
       event: handleEnd,
        },
    ],
  },
})

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

const list = ref([]);
const selectionList = ref([])
// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  const formData = PageSearchPanelRef.value.getFormData();
  const {res, err} = await proxy.$$api.interface.list({params: Object.assign(proxy.$$formatELDateTimeRange(formData.timeRange, ['startTime', 'endTime']), pageInfo.value, formData)});
  if (err) return;
  pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
  list.value = res?.rows || [];
};
function autoStartHidden(val) {
      if (val.row) {
        return val.row.status == "0" ? true : false
      } else {
        return false;
      }
  }
function autoEndHidden(val) {
      if (val.row) {
        return val.row.status == "1" ? true : false
      } else {
        return false;
      }
  }
//启用
function handleStart(row) {
  proxy.$$Dialog
    .confirm('是否确认启用接口名称为"' + row.interfaceName + '"的数据项？')
    .then(() => {
      let data = {
        interfaceId: row.interfaceId,
        status: 1
      };
      return proxy.$$api.interface.changeStatus({data: data});
    })
    .then(({res, err}) => {
      if (err) return;
      getList(1);
      proxy.$$Toast.success("启用成功");
    })
    .catch(() => {
    });
}
//停用
function handleEnd(row) {
  proxy.$$Dialog
   .confirm('是否确认停用接口名称为"' + row.interfaceName + '"的数据项？')
   .then(() => {
     let data = {
      status: 0,
      interfaceId: row.interfaceId
     };
     return proxy.$$api.interface.changeStatus({data: data});
   })
   .then(({res, err}) => {
     if (err) return;
     getList(1);
     proxy.$$Toast.success("停用成功");
   })
   .catch(() => {
   });
}
function handleSelectionChange(value) {
  selectionList.value = value
}

function handleDel(row) {
  proxy.$$Dialog.confirm('确认删除选中的数据吗？', '提示').then(async () => {
    const interfaceIds = selectionList.value.map(item => {
      return item.interfaceId
    }).join(',')
    const {res, err} = await proxy.$$api.interface.delete({data: {status: 2}, interfaceIds});
    if (err) return;
    getList(1);
    proxy.$$Toast({message: `删除成功`, type: 'success'});
  }).catch(proxy.$$emptyFn);
}

// function handleStatusChange(row) {
//   let text = row.status === 1 ? "启用" : "停用";
//   proxy.$$Dialog.confirm('确认要"' + text + '""' + row.interfaceName + '"接口吗？').then(() => {
//     return proxy.$$api.interface.changeStatus({data: {status: row.status, interfaceId: row.interfaceId}});
//   }).then(({res, err}) => {
//     if (err) return;
//     getList(1);
//     proxy.$$Toast.success(text + "成功");
//   }).catch(function () {
//     row.status = row.status === 0 ? 1 : 0;
//   });
// }
//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {name: '接口编码', key: 'interfaceCode', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '接口名称', key: 'interfaceName', value: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '请求方式', key: 'interfaceMethod', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('interface_request_method'), isDisable: !1, isRequire: !1},
  {name: '接口规范类型', key: 'interfaceNormType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('interface_specification_type'), isDisable: !1, isRequire: !1},
  {name: '接口类型', key: 'interfaceType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('interface_type'), isDisable: !1, isRequire: !1},
  {name: '接口联系信息', key: 'interfaceInfo', value: '', col: 6, type: 'input', isDisable: !1, isRequire: !1},
  {name: '状态', key: 'status', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('start_stop'), isDisable: !1, isRequire: !1},
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
        },
        isShow({vm}) {
          return props.type !== 'FormModel'
        }
      },
      {
        btnName: '新增', type: 'button', attrs: {type: 'success'}, col: 1,
        onClick({vm}) {
          // 打开弹窗
          select_pkid.value = null;
          isShowAddDialog.value = !0;
        },
        isShow({vm}) {
          return props.type !== 'FormModel'
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
  cusDicts: ['interface_request_method', 'interface_specification_type', 'interface_type', 'start_stop']
}
</script>
<style lang="scss" scoped>
</style>
