<template>
  <div class="app-container one-screen">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="tree_productName"
            placeholder="请输入产品名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container nodeTree">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <div class="one-screen-fg1">
        <el-col :span="20" :xs="24" style="width: 100%; height: 100%">
          <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="auto"
          >
            <el-form-item label="投诉产品编码" prop="productCode">
              <el-input
                v-model="queryParams.productCode"
                placeholder="请输入投诉产品编码"
                clearable
                class="queryItem"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="投诉产品名称" prop="productName ">
              <el-input
                v-model="queryParams.productName"
                placeholder="请输入投诉产品名称"
                clearable
                 class="queryItem"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="是否省自定义" >
            <el-select
              v-model="queryParams.isProvinceCustom"
              placeholder="请选择是否省自定义"
              clearable
              class="queryItem"
            >
            <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('yes_no')"
              :key=" dict.value"
              :label="dict.label"
              :value="dict.value"
          />
            </el-select>
          </el-form-item>
            <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              class="queryItem"
            >
            <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('start_stop')"
              :key=" dict.value"
              :label="dict.label"
              :value="dict.value"
          />
            </el-select>
          </el-form-item>
            <!-- <el-form-item label="投诉产品类型" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请输入投诉产品类型"
              clearable
               class="queryItem"
            >
              <el-option
                v-for="dict in productTypeList"
                v-bind="dict"
                :key="dict.value"
              />
            </el-select>
          </el-form-item> -->

            <!-- <el-form-item label="省" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户省"
              clearable
               class="queryItem"
            >
              <el-option
                v-for="dict in $$dictionaries.get('sys_normal_disable')"
                v-bind="dict"
                :key="dict.value"
              />
            </el-select>
          </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8"   v-show="currentNode.productLevel === 1">
            <el-col :span="1.5">
              <!--   v-show="currentNode." -->
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermission="['system:user:add']"
                >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermission="['system:user:remove']"
                >删除
              </el-button>
            </el-col>
          </el-row>
          <div style="height: 70vh">
            <div class="one-screen">
              <div class="one-screen-fg1">
                <JsTable
                  :dataSource="dataSource"
                  :columns="columns"
                  @selectionChange="handleSelectionChange"
                >
                  <template #isProvinceCustom="{ row }">
                    <div>{{ row.isProvinceCustom ? "自定义" : "否" }}</div>
                  </template>
                  <template #status="{ row }">
                    <div v-show="row.status == 0"><el-tag type="danger">停用</el-tag></div>
                    <div v-show="row.status == 1"><el-tag>启用</el-tag></div>
                    <div v-show="row.status == 2"><el-tag type="danger">删除</el-tag></div>
                  </template>
                </JsTable>
              </div>
            </div>
          </div>

          <el-pagination
            :current-page.sync="queryParams.pageNum"
            :page-size.sync="queryParams.pageSize"
            :page-sizes="[15, 30, 40, 50]"
            background
            layout=" ->,total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getList"
            @current-change="getList"
          />

          <!--        <el-pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>-->
        </el-col>
      </div>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品一级">
              <el-input
                v-model="form.oneProductName"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品一级编码">
              <el-input
                v-model="form.oneProductCode"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品二级">
              <el-input
                v-model="form.productName"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品二级编码">
              <el-input
                v-model="form.productCode"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-checkbox v-model="form.customProvince"
              >是否省自定义</el-checkbox
            >
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

<script>
import Treeselect from "@riophae/vue-treeselect";
import JsTable from "@/components/js-table/index.vue";
export default {
  name: "UserIndex",
  cusDicts: ['start_stop','yes_no'],
  components: { Treeselect, JsTable },
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: "123456",
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 树搜索项
      tree_productName:"",
      // 是否允许新增
      addFlag:false,
      // 表单参数
      form: {},
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
            width:130,
            key: "updatedTime",
          },
        ],
        options: {
          // width: 160,
          btns: [
            {
              label: "编辑",
              key: "edit",
              event: this.handleUpdate,
            },
            {
              label: "删除",
              key: "del",
              type: "danger",
              event: this.handleDelete,
            },
            {
              label: "启动",
              key: "start",
              type: "primary",
              autoHidden: this.autoStartHidden,
              event: this.handleStart,
            },
            {
              label: "停用",
              key: "end",
              type: "danger",
              autoHidden: this.autoEndHidden,
              event: this.handleEnd,
            },
          ],
        },
      },
      dataSource: [],
      currentNode: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        pcode: undefined,
        productCode: undefined,
        productName: undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        productCode: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
          {
            pattern: /^[^<>"'|\\]+$/,
            message: "不能包含非法字符：< > \" ' \\\ |",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        productName: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    tree_productName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getProductTree();
    this.$nextTick(() => this.$refs.table?.doLayout());
    // this.getConfigKey("sys.user.initPassword").then(response => {
    //   this.initPassword = response.msg;
    // });
  },
  methods: {
    autoStartHidden(val) {
      if (val.row) {
        return val.row.status == "0" ? true : false;
      } else {
        return false;
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return val.row.status == "1" ? true : false;
      } else {
        return false;
      }
    },
    // 启用
    handleStart(row) {
      this.$$Dialog
        .confirm('是否确认启动投诉产品编号为"' + row.productId + '"的数据项？')
        .then(() => {
          let data = {
            productId: row.productId,
            status: 1,
          };
          return this.$$api.productClassification.updStatus({ data: data });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.$$Toast.success("启动成功");
        })
        .catch(() => {});
    },
    // 停用
    handleEnd(row) {
      this.$$Dialog
        .confirm('是否确认停用投诉产品编号为"' + row.productId + '"的数据项？')
        .then(() => {
          let data = {
            productId: row.productId,
            status: 0,
          };
          return this.$$api.productClassification.updStatus({ data: data });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.$$Toast.success("停用成功");
        })
        .catch(() => {});
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
      // this.userList = Array.from({ length: 20 }).map((r, i) => ({ userId: i }));
      // this.dataSource=[
      //   {
      //     productCode: '63421',
      //     productName: '产品1',
      //     type: 'A',
      //     isProvince: true,
      //     province: '北京',
      //     updateName: '张三',
      //     updataTime: '2020-12-11',
      //   },
      //   {
      //     productCode: '78965',
      //     productName: '产品2',
      //     type: 'B',
      //     isProvince: false,
      //     province: '上海',
      //     updateName: '李四',
      //     updataTime: '2021-01-11',
      //     },
      //     {
      //       productCode: '54879',
      //       productName: '产品3',
      //       type: 'A',
      //       isProvince: true,
      //       province: '广东',
      //       updateName: '王五',
      //       updataTime: '2021-02-11',
      //       },
      // ]
      // return (this.total = this.dataSource.length);
      this.loading = true;
      this.$$api.productClassification
        .listProduct({
          params: this.queryParams,
        })
        .then(({ res: response, err }) => {
          if (err) return;
          this.dataSource = response.rows;
          this.total = response.total;
          this.loading = false;
        }); 
    },
    /** 查询部门下拉树结构 */
    getProductTree() {
      this.$$api.productClassification
        .listProductTree()
        .then(({ res: response, err }) => {
          if (err) return;
          this.deptOptions = response.list;
        });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.productName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if(data.productLevel==2)return
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
      this.queryParams.isProvinceCustom = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productId);
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
        .getProductCode({ data })
        .then(({ res: response, err }) => {
          if (err) return;
          this.form.productCode = response.productCode;
          // this.deptOptions = response.res;
        });
    },
    getCurrentTreeNodeInfo(ID) {
      this.$$api.productClassification
        .getProductDetail({ productId: ID })
        .then(({ res: response, err }) => {
          if (err) return;
          let {
            productName,
            productCode,
            productId,
            productLevel,
            oneProductCode,
            oneProductName,
          } = { ...response };
          this.form.oneProductCode = oneProductCode;
          this.form.oneProductName = oneProductName;
          this.form.productId = productId;
          if (productLevel == 1) {
            this.form.oneProductCode = productCode;
            this.form.oneProductName = productName;
          }
          if (productLevel == 2) {
            this.form.productName = productName;
            this.form.productCode = productCode;
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
              .updateProduct({ data: this.form })
              .then(({ res, err }) => {
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
              .addProduct({ data: data })
              .then(({ res, err }) => {
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
      const productIds = row.productId || this.ids;
      this.$$Dialog
        .confirm('是否确认删除投诉产品编号为"' + productIds + '"的数据项？')
        .then(() => {
          let data = {
            productIds: Array.isArray(productIds)
              ? productIds.join(",")
              : productIds,
          };
          return this.$$api.productClassification.delProduct(data);
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.getProductTree();
          this.$$Toast.success("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style>
.nodeTree {
  overflow: scroll;
  height: 74vh;
}
.queryItem {
  width: 240px;
}
::v-deep .el-form-item__label{
  width: 100px
}
</style>
