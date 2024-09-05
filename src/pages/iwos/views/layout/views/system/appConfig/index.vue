<template>
  <div class="public-background one-screen">
    <!-- noBackground -->
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems" noBackground style="margin-bottom: 0;"></PageSearchPanel>
    <JsTable
        :dataSource="state.dataSource"
        :columns="state.columns"
        @selectionChange="handleSelectionChange"
    >
      <template #status="{ row }">
        {{ ({0: '停用', 1: '启用', 2: '删除'})[row.status] ?? '-' }}
      </template>
    </JsTable>
    <el-pagination
        :current-page.sync="state.queryParams.pageNum"
        :page-size.sync="state.queryParams.pageSize"
        :page-sizes="[15, 30, 40, 50]"
        background
        layout=" ->,total, sizes, prev, pager, next, jumper"
        :total="state.total"
        @size-change="getList"
        @current-change="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
        :title="state.title"
        :visible.sync="state.open"
        width="6rem"
        append-to-body
        :close-on-click-modal="!1"
    >
      <el-form
          ref="form"
          :model="state.form"
          :rules="state.rules"
          label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="应用系统名称" prop="appName">
              <el-input
                  v-model="state.form.appName"
                  placeholder="请输入"
                  maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="投诉来源" prop="sourceCode">
              <!-- <el-input
                v-model="state.form.sourceCode"
                placeholder="请输入"
                maxlength="50"
              ></el-input> -->
              <treeselect
                  v-model="state.form.sourceCode"
                  :options="state.sourceTree"
                  :show-count="true"
                  noOptionsText="暂无数据"
                  placeholder="请选择投诉来源"
                  :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="应用系统描述">
              <el-input
                  v-model="state.form.appDesc"
                  placeholder="请输入"
                  type="textarea"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import JsTable from "@/components/js-table/index.vue";
import Treeselect from "@riophae/vue-treeselect";
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {
    name: "应用系统名称",
    key: "appName",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "应用系统编号",
    key: "clientId",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "应用系统描述",
    key: "appDesc",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "状态",
    key: "status",
    value: "",
    col: 6,
    type: "select",
    options: () =>
        proxy.$store.getters["dictionaries/GET_DICT"]("start_stop"),
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "投诉来源",
    key: "sourceCode",
    value: "",
    col: 6,
    type: "cascader",
    options: () =>
        proxy.$store.getters["dictionaries/GET_DICT"]("complaintSourceTree"),
    attrs: {props: {checkStrictly: !0}},
    isDisable: !1,
    isRequire: !1,
  },
  {col: 6, type: "divider-empty"},
  {col: 6, type: "divider-empty"},
  {
    type: "buttons",
    verticalAlign: 'top',
    align: "right",
    col: 6,
    items: [
      {
        btnName: "查询",
        type: "button",
        attrs: {type: "primary"},
        col: 1,
        permission: ['config:appInfo:query'],
        onClick({vm}) {
          handleQuery();
        },
      },
      {
        btnName: "重置",
        type: "button",
        attrs: {type: ""},
        col: 1,
        onClick({vm}) {
          vm.resetFormData();
          resetQuery();
        },
      },
      {
        btnName: "新增",
        type: "button",
        attrs: {type: "success"},
        permission: ['config:appInfo:add'],
        col: 1,
        onClick({vm}) {
          handleAdd();
        },
      },
      {
        btnName: "删除",
        type: "button",
        attrs: {
          type: "danger", disabled: () => {
            return state.value.multiple
          }
        },
        permission: ['config:appInfo:remove'],
        col: 1,
        onClick({vm}) {
          handleDelete();
        },
      },
      // {
      //   btnName: '新增', type: 'button', attrs: {type: 'success'}, col: 1,
      //   onClick({vm}) {
      //     // 打开弹窗
      //     select_pkid.value = null;
      //     isShowAddDialog.value = !0

      //   }
      // },
    ],
  },
]);
const {proxy} = getCurrentInstance();

onMounted(() => {
  getList(1);
  listComplaintSourceTree();
});
const autoStartHidden = (val) => {
  if (val.row) {
    return val.row.status == "0" ? true : false;
  } else {
    return false;
  }
};
const autoEndHidden = (val) => {
  if (val.row) {
    return val.row.status == "1" ? true : false;
  } else {
    return false;
  }
};
// 启用
const handleStart = (row) => {
  proxy.$$Dialog
      .confirm('是否确认启用应用系统编号为"' + row.clientId + '"的数据项？')
      .then(() => {
        let data = {
          appId: row.appId,
          status: 1,
        };
        return proxy.$$api.appconfigmanage.updStatusappConfig({data: data});
      })
      .then(({res, err}) => {
        if (err) return;
        handleQuery();
        proxy.$$Toast.success("启用成功");
      })
      .catch(() => {
      });
};
// 停用
const handleEnd = (row) => {
  proxy.$$Dialog
      .confirm('是否确认停用应用系统编号为"' + row.clientId + '"的数据项？')
      .then(() => {
        let data = {
          appId: row.appId,
          status: 0,
        };
        return proxy.$$api.appconfigmanage.updStatusappConfig({data: data});
      })
      .then(({res, err}) => {
        if (err) return;
        handleQuery();
        proxy.$$Toast.success("停用成功");
      })
      .catch(() => {
      });
};
/** 查询机构下拉树结构 */
const getSourceTree = () => {
  proxy.$$api.complaintSource.listComplaintSourceTree({data: {status: 1}}).then(({res, err}) => {
    if (err) return;
    state.value.sourceTree = res?.list || [];
  });
};
/** 转换班组数据结构 */
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children;
  }
  return {
    id: node.sourceCode,
    label: node.sourceName,
    children: node.children,
  };
};
//投诉来源下拉菜单
const listComplaintSourceTree = async () => {
  if (
      proxy.$store.getters["dictionaries/GET_DICT"]("complaint_source_tree")
          ?.length
  )
    return;
  const {res, err} =
      await proxy.$$api.complaintSource.listComplaintSourceTree({data: {status: 1}});
  if (err) return;
  proxy.$store.commit("dictionaries/SET_DICTIONARIES", {
    complaintSourceTree: proxy.$$formatCascaderTree(
        res?.list || [],
        "sourceName",
        "sourceCode",
        "children"
    ),
  });
};
let PageSearchPanelRef = ref()
const getList = () => {
  state.value.loading = true;

  let params = {
    ...state.value.queryParams,
    ...PageSearchPanelRef.value.getFormData()
  }
  if (params.sourceCode && params.sourceCode.length > 0) {
    params.sourceCode = params.sourceCode[params.sourceCode.length - 1]
  }
  proxy.$$api.appconfigmanage
      .listappConfig({params: params})
      .then(({res: response, err, total}) => {
        if (err) return (state.value.loading = false);
        state.value.dataSource = response.rows;
        state.value.total = response.total;
        state.value.loading = false;
      });
};
// 取消按钮
const cancel = () => {
  state.value.open = false;
  reset();
};
let form = ref();
// 表单重置
const reset = () => {
  state.value.form = {
    appName: undefined,
    appDesc: undefined,
    sourceCode: undefined,
  };
  form.value?.resetFields();
};
/** 搜索按钮操作 */
const handleQuery = () => {
  state.value.queryParams.pageNum = 1;
  getList();
};
let queryForm = ref();
/** 重置按钮操作 */
const resetQuery = () => {
  queryForm.value?.resetFields();
  handleQuery();
};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  state.value.form.dictType = state.value.currentType;
  state.value.open = true;
  state.value.title = "应用系统管理维护";
  getSourceTree();
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  state.value.ids = selection.map((item) => item.appId);
  state.value.single = selection.length != 1;
  state.value.multiple = !selection.length;
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  getSourceTree();
  proxy.$$api.appconfigmanage
      .appConfigDetail({appId: row.appId})
      .then(({res: response, err}) => {
        if (err) return;
        state.value.form = response;
        state.value.open = true;
        state.value.title = "修改应用系统";
      });
};
/** 提交按钮 */
const submitForm = () => {
  form.value.validate((valid) => {
    if (valid) {
      if (state.value.form.appId != undefined) {
        proxy.$$api.appconfigmanage
            .updateappConfig({data: state.value.form})
            .then(({res: response, err}) => {
              if (err) return;
              proxy.$$Toast.success("修改成功");
              state.value.open = false;
              getList();
            });
      } else {
        proxy.$$api.appconfigmanage
            .addappConfig({data: state.value.form})
            .then(({res: response, err}) => {
              if (err) return;
              proxy.$$Toast.success("新增成功");
              state.value.open = false;
              getList();
            });
      }
    }
  });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const appIds = row?.appId || state.value.ids;
  proxy.$$Dialog
      .confirm('是否确认删除应用系统编码为"' + appIds + '"的数据项？')
      .then(() => {
        let data = {
          appIds: Array.isArray(appIds) ? appIds.join(",") : appIds,
        };
        return proxy.$$api.appconfigmanage.delappConfig(data);
      })
      .then(({res, err}) => {
        if (err) return;
        getList();
        proxy.$$Toast.success("删除成功");
      })
      .catch(() => {
      });
};
let state = ref({
  // 遮罩层
  loading: true,
  //投诉来源数据
  complaintSourceTree: [],
  // 省数据
  provinceOptions: [],
  sourceTree: [],
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 弹出层标题
  title: "",
  // 是否显示弹出层
  open: false,
  columns: {
    selection: true,
    props: [
      {
        name: "应用系统编号",
        key: "clientId",
      },
      {
        name: "应用系统名称",
        key: "appName",
      },
      {
        name: "应用系统描述",
        key: "appDesc",
      },
      {
        name: "投诉来源",
        key: "sourceName",
      },
      {
        name: "状态",
        key: "status",
      },
      {
        name: "省公司名称",
        key: "provinceName",
      },
      {
        name: "创建人",
        key: "createdBy",
      },

      {
        name: "创建时间",
        key: "createdTime",
      },
    ],
    options: {
      btns: [
        {
          label: "修改",
          key: "edit",
          permission: ['config:appInfo:edit'],
          event: handleUpdate,
        },
        {
          label: "删除",
          key: "del",
          type: "danger",
          permission: ['config:appInfo:remove'],
          event: handleDelete,
        },
        {
          label: "启用",
          key: "start",
          type: "primary",
          permission: ['config:appInfo:edit'],
          autoHidden: autoStartHidden,
          event: handleStart,
        },
        {
          label: "停用",
          key: "end",
          type: "danger",
          permission: ['config:appInfo:edit'],
          autoHidden: autoEndHidden,
          event: handleEnd,
        },
      ],
    },
  },
  dataSource: [],
  // 日期范围
  dateRange: [],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 15,
    appName: undefined,
    clientId: undefined,
    appDesc: undefined,
    status: undefined,
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {
    appName: [
      {required: true, message: "应用系统名称不能为空", trigger: "blur"},
    ],
    sourceCode: [
      {required: true, message: "投诉来源不能为空", trigger: "blur"},
    ],
  },
});
</script>
<script>
export default {
  name: "AppConfigManage",
  dicts: [
    "start_stop",
    "base_province_code",
  ],
};
</script>
<style scoped>
::v-deep .el-color-picker__trigger {
  width: 132px;
}

::v-deep .el-color-picker__empty,
::v-deep .el-color-picker__icon {
  left: 90%;
}

.queryItem {
  width: 240px;
}
</style>
