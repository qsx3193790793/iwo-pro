<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--机构数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="tree_productName"
              placeholder="请输入产品名称"
              clearable
              size="small"
              maxlength="30"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
          >
            <template slot="append">
              <el-button type="primary" @click="handleCheckedTreeExpand">{{ isExpend ? '折叠' : '展开' }}</el-button>
            </template>
          </el-input>
        </div>
        <div class="head-container nodeTree one-screen-fg1 search_tree">
          <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="productId"
              default-expand-all
              :highlight-current='true'
              @node-click="handleNodeClick"
          />
        </div>
      </div>
      <!--用户数据-->
      <div class="one-screen one-screen-fg1">
        <PageSearchPanel
            class="one-screen-fg0"
            ref="PageSearchPanelRef"
            :formConfigItems="formConfigItems"
            noBackground style="margin-bottom: 0;"
        ></PageSearchPanel>
        <JsTable
            class="one-screen-fg1"
            :dataSource="dataSource"
            :columns="columns"
            @selectionChange="handleSelectionChange"
        >
          <template #isProvinceCustom="{ row }">
            <div>{{ row.isProvinceCustom ? "是" : "否" }}</div>
          </template>
          <template #status="{ row }">
            {{ ({0: '停用', 1: '启用', 2: '删除'})[row.status] ?? '-' }}
          </template>
        </JsTable>

        <el-pagination
            class="one-screen-fg0"
            :current-page.sync="queryParams.pageNum"
            :page-size.sync="queryParams.pageSize"
            :page-sizes="[15, 30, 40, 50]"
            background
            layout=" ->,total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getList"
            @current-change="getList"
        />
      </div>
    </div>

    <!-- 添加或修改用户配置对话框 -->
    <MDialog  v-model="open" :title="title" width="7rem">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品一级" prop="oneProductName">
              <el-input
                  :disabled="form.oneProductNameEdit"
                  v-model="form.oneProductName"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品一级编码" prop="oneProductCode">
              <el-input
                  v-model="form.oneProductCode"
                  disabled
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- &&form.handleType!='edit' -->
        <el-row :gutter="20" v-if="(currentNode.level>1&&form.handleType=='edit'||currentNode.level==1&&form.handleType=='add')">
          <el-col :span="12">
            <el-form-item label="产品二级" prop="productName">
              <el-input
                  :disabled="form.productNameEdit"
                  v-model="form.productName"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品二级编码" prop="productCode">
              <el-input
                  v-model="form.productCode"
                  disabled
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-checkbox v-model="form.customProvince" disabled
            >省自定义
            </el-checkbox
            >
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </MDialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import JsTable from "@/components/js-table/index.vue";
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import MDialog from '@/components/MDialog';
export default {
  name: "ProductClassification",
  dicts: ['start_stop', 'yes_no'],
  components: {Treeselect, JsTable, PageSearchPanel,MDialog},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 产品编码
      productCodeList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 机构树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 机构名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 树搜索项
      tree_productName: "",
      // 是否允许新增
      addFlag: false,
      //树形组件是否展开
      isExpend: true,
      // 表单参数
      form: {},
      formConfigItems: [
        {
          name: "投诉产品编码",
          key: "productCode",
          value: "",
          type: "input",
          placeholder: "投诉产品编码",
          col: 6,
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "投诉产品名称",
          key: "productName",
          value: "",
          type: "input",
          placeholder: "投诉产品名称",
          col: 6,
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "是否省自定义",
          key: "isProvinceCustom",
          value: "",
          col: 6,
          type: "select",
          options: () =>
              this.$store.getters["dictionaries/GET_DICT"]("yes_no"),
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
              this.$store.getters["dictionaries/GET_DICT"]("start_stop"),
          isDisable: !1,
          isRequire: !1,
        },
        {col: 6, type: "divider-empty"},
        {col: 6, type: "divider-empty"},
        {col: 6, type: "divider-empty"},
        {
          type: "buttons",
          align: "right",
          verticalAlign: "top",
          col: 6,
          items: [
            {
              btnName: "重置",
              type: "button",
              attrs: {type: ""},
              col: 1,
              onClick: ({vm}) => {
                vm.resetFormData();
                this.resetQuery();
              }
            },
            {
              btnName: "查询",
              type: "button",
              permission: ['config:product:query'],
              attrs: {type: "primary"},
              col: 1,
              onClick: ({vm}) => {
                this.handleQuery();
              },
            },
            {
              btnName: "新增",
              type: "button",
              permission: ['config:product:add'],
              attrs: {
                type: "success", disabled: () => {
                  return this.currentNode.productLevel !== 1;
                }
              },
              col: 1,
              onClick: ({vm}) => {
                this.handleAdd()
              },
            },
            {
              btnName: '删除', type: 'button', attrs: {type: 'danger', disabled: () => !this.ids.length || this.currentNode.productLevel !== 1}, col: 1,
              permission: ['config:product:remove'],
              onClick: ({vm}) => {
                this.handleDelete();
              }
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "productName",
      },
      columns: {
        selection: true,
        props: [
          {
            name: "投诉产品编码",
            key: "productCode",
          },
          {
            name: "投诉产品名称",
            key: "productName",
          },
          {
            name: "是否省自定义",
            key: "isProvinceCustom",
          },
          {
            name: "状态",
            key: "status",
          },
          // {
          //   name: "省",
          //   key: "province",
          // },
          {
            name: "更新人",
            key: "updatedBy",
          },
          {
            name: "更新时间",
            width: 160,
            key: "updatedTime",
          },
          {
            name: "节点层级链",
            key: "productChain",
          },
        ],
        options: {
          // width: 160,
          btns: [
            {
              label: "修改",
              key: "edit",
              event: this.handleUpdate,
              autoHidden: this.autoHandleHidden,
              permission: ['config:product:edit'],
            },
            {
              label: "删除",
              key: "del",
              type: "danger",
              autoHidden: this.autoHandleHidden,
              permission: ['config:product:remove'],
              event: (val) => {
                this.handleDelete(val)
              }
            },
            {
              label: "更多",
              key: "more",
              permission: ['config:product:edit'],
              children: [
                {
                  label: "启用",
                  key: "start",
                  type: "primary",
                  autoHidden: this.autoStartHidden,
                  permission: ['config:product:edit'],
                  event: this.handleStart,
                },
                {
                  label: "停用",
                  key: "end",
                  type: "danger",
                  autoHidden: this.autoEndHidden,
                  permission: ['config:product:edit'],
                  event: this.handleEnd,
                },
              ]
            },
          ],
        },
      },
      dataSource: [],
      currentNode: {
        level: 0
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        pcode: undefined,
      },
      // 表单校验
      rules: {
        productCode: [
          {required: true, message: "用户名称不能为空", trigger: "blur"},
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        oneProductName: [
          {required: true, message: "产品一级名称不能为空", trigger: "blur"},
        ],
        oneProductCode: [
          {required: true, message: "产品一级编码不能为空", trigger: "blur"},
        ],
        productName: [
          {required: true, message: "产品二级名称不能为空", trigger: "blur"},
        ],
        productCode: [
          {required: true, message: "产品二级编码不能为空", trigger: "blur"},
        ],

      },
    };
  },
  watch: {
    // 根据名称筛选机构树
    tree_productName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  mounted() {
    this.getList();
    this.getProductTree();
  },
  methods: {
    // 树权限（展开/折叠）
    handleCheckedTreeExpand() {
      this.isExpend = !this.isExpend;
      this.$$treeExpandOrCollapse(this.$refs.tree, this.isExpend);
    },
    autoHandleHidden(val) {
      if (val.row) {
        return val.row.isProvinceCustom != "0" ? true : false;
      } else {
        return false;
      }
    },
    autoStartHidden(val) {
      if (val.row) {
        return (val.row.status == "0" && val.row.isProvinceCustom != "0") ? true : false;
      } else {
        return false;
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return (val.row.status == "1" && val.row.isProvinceCustom != "0") ? true : false;
      } else {
        return false;
      }
    },
    // 启用
    handleStart(row) {
      this.$$Dialog
          .confirm('是否确认启用投诉产品编号为"' + row.productCode + '"的数据项？')
          .then(() => {
            let data = {
              productId: row.productId,
              status: 1,
            };
            return this.$$api.productClassification.updStatus({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("启用成功");
          })
          .catch(() => {
          });
    },
    // 停用
    handleEnd(row) {
      this.$$Dialog
          .confirm('是否确认停用投诉产品编号为"' + row.productCode + '"的数据项？')
          .then(() => {
            let data = {
              productId: row.productId,
              status: 0,
            };
            return this.$$api.productClassification.updStatus({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("停用成功");
          })
          .catch(() => {
          });
    },
    // 根据pCode获取投诉产品列表(投诉产品下拉框使用)
    // productTypeList(NodeId){
    //   this.$$api.productClassification.productTypeList().then((response) => {
    //     this.deptOptions = response.data;
    //   });
    //   console.log(NodeId)
    // },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      this.$$api.productClassification
          .listProduct({
            params: {
              ...formData,
              ...this.queryParams
            },
          })
          .then(({res: response, err}) => {
            if (err) return;
            this.dataSource = response.rows;
            this.total = response.total;
            this.loading = false;
          });
    },
    /** 查询机构下拉树结构 */
    getProductTree() {
      this.$$api.productClassification
          .listProductTree()
          .then(({res: response, err}) => {
            if (err) return;
            let data = [{
              productLevel: 0,
              productCode: '0',
              productId: '0',
              productName: '投诉产品',
              children: response.list
            }]
            this.deptOptions = data;
          });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) {
        this.isExpend = true;
        this.$$treeExpandOrCollapse(this.$refs.tree, this.isExpend);
        return true;
      }
      this.isExpend = true;
      return data.productName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // if (data.productLevel == 2) return this.dataSource=[]
      this.$refs["queryForm"]?.resetFields();
      this.currentNode = data;
      this.queryParams.pcode = data.productCode;
      this.handleQuery();
    },
    // 用户状态修改
    // handleStatusChange(row) {
    //   let text = row.status === "0" ? "启用" : "停用";
    //   this.$$Dialog
    //     .confirm('确认要"' + text + '""' + row.productCode + '"用户吗？')
    //     .then(function () {
    //       return this.$$api.user.changeUserStatus({
    //         data: { userId: row.userId, status: row.status },
    //       });
    //     })
    //     .then(({ res, err }) => {
    //       if (err) return;
    //       this.$$Toast.success(text + "成功");
    //     })
    //     .catch(function () {
    //       row.status = row.status === "0" ? "1" : "0";
    //     });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        productCode: undefined,
        productName: undefined,
        oneProductCode: undefined,
        oneProductName: undefined,
        productId: undefined,
        customProvince: true,
        handleType: "",
      };
      this.$refs["form"]?.resetFields();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.$refs["queryForm"]?.resetFields();
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productId);
      this.productCodeList = selection.map((item) => item.productCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 增删改查只允许在二级目录下进行
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.handleType = "add";
      this.title = "产品维护";
      this.open = true;
      this.getchannelCode(this.currentNode.productCode);
      this.getCurrentTreeNodeInfo(this.currentNode.productId);
    },
    getchannelCode(Code) {
      let data = {
        pcode: Code,
      };
      this.$$api.productClassification
          .getProductCode({data})
          .then(({res: response, err}) => {
            if (err) return;
            this.form.productCode = response.productCode;
            // this.deptOptions = response.res;
          });
    },
    getCurrentTreeNodeInfo(ID) {
      this.$$api.productClassification
          .getProductDetail({productId: ID})
          .then(({res: response, err}) => {
            if (err) return;
            let {
              productName,
              productCode,
              productId,
              productLevel,
              oneProductCode,
              oneProductName,
              isProvinceCustom
            } = {...response};
            this.form.oneProductCode = oneProductCode;
            this.form.oneProductName = oneProductName;
            this.form.productId = productId;
            this.currentNode.level = productLevel;
            if (this.form.handleType == "edit") {
              this.form.customProvince = isProvinceCustom ? true : false
            }
            if (productLevel == 1) {
              this.form.oneProductCode = productCode;
              this.form.oneProductName = productName;
              this.form.productNameEdit = true;
              if (this.form.handleType == 'add') {
                this.form.oneProductNameEdit = true;
                this.form.productNameEdit = false;
              }
            }
            if (productLevel == 2) {
              this.form.productName = productName;
              this.form.productCode = productCode;
              this.form.oneProductNameEdit = true;
            }

          });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.handleType = "edit";
      const productId = row.productId;
      this.getCurrentTreeNodeInfo(productId);
      this.title = "渠道维护";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.handleType == "edit") {
            this.$$api.productClassification
                .updateProduct({data: this.form})
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                  this.getProductTree();
                });
          } else {
            let data = {
              productCode: this.form.productCode,
              pcode: this.currentNode.productCode,
              productName: this.form.productName,
            };
            this.$$api.productClassification
                .addProduct({data: data})
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("新增成功");
                  this.open = false;
                  this.getList();
                  this.getProductTree();
                });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const productIds = row?.productId || this.ids;
      let showText = ''
      if (this.ids.length > 0 && !row?.productId) {
        showText = this.productCodeList.join(',')
      } else {
        showText = row?.productCode
      }
      this.$$Dialog
          .confirm('是否确认删除投诉产品编号为"' + showText + '"的数据项？')
          .then(() => {
            let data = {
              productIds: Array.isArray(productIds)
                  ? productIds.join(",")
                  : productIds,
            };
            return this.$$api.productClassification.delProduct(data);
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.getProductTree();
            this.$$Toast.success("删除成功");
          })
          .catch(() => {
          });
    },

  },
};
</script>
<style scoped lang="scss">
.nodeTree {
  overflow: scroll;
  height: 74vh;
}

.queryItem {
  width: 240px;
}

::v-deep .el-form-item__label {
  width: 100px
}
</style>
