<template>
  <div class="app-container one-screen">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="tree_sourceName"
            placeholder="请输入投诉来源名称"
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
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="auto"
        >
          <el-form-item label="建单来源" prop="sourceName">
            <el-input
              v-model="queryParams.sourceName"
              placeholder="请输入投诉现象编码"
              clearable
              class="queryItem"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="是否省自定义">
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

        <el-row :gutter="10" class="mb8" style="width: 100%; height: 100%">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-show="currentNode.level !== 3 &&currentNode.level !== 0"
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源一级">
              <el-input
                :disabled="!!form.oneSourceEdit"
                v-model="form.oneSourceName"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源一级编码">
              <el-input
                :disabled="!!form.oneSourceCode"
                v-model="form.oneSourceCode"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
           v-if="currentNode.level >1||(currentNode.level == 1&&form.handleType == 'add') "
        >
          <el-col :span="12">
            <el-form-item label="来源二级">
              <el-input
                :disabled="!!form.twoSourceEdit"
                v-model="form.twoSourceName"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源二级编码">
              <el-input
                :disabled="!!form.twoSourceCode"
                v-model="form.twoSourceCode"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          v-if="currentNode.level == 3||(currentNode.level == 2&&form.handleType == 'add') "
        >
          <el-col :span="12">  
            <el-form-item label="建单来源">
              <el-input
                :disabled="!!form.threeSourceEdit"
                v-model="form.sourceName"
                placeholder="请输入"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建单来源编码">
              <el-input
                :disabled="!!form.sourceCode"
                v-model="form.sourceCode"
                placeholder="请输入"
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
      // 树筛选项
      tree_sourceName:'',
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "sourceName",
      },
      columns: {
        selection: true,
        props: [
          {
            name: "来源名称",
            key: "sourceName",
          },
          {
            name: "来源编码",
            key: "sourceCode",
          },
          {
            name: "状态",
            key: "status",
          },
          {
            name: "更新人",
            key: "closingContent",
          },
          {
            name: "更新时间",
            key: "updataTime",
          },
        ],
        options: {
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
      currentNode: {
        level:0
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        sourceName: undefined,
        isProvinceCustom: undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        sourceName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选来源树
    tree_sourceName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTree();
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
        .confirm('是否确认启动来源编码为"' + row.sourceId + '"的数据项？')
        .then(() => {
          let data = {
            sourceId: row.sourceId,
            status: 1,
          };
          return this.$$api.complaintSource
          .updStatus({ data: data});
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
        .confirm('是否确认停用来源编码为"' + row.sourceId + '"的数据项？')
        .then(() => {
          let data = {
            sourceId: row.sourceId,
            status: 0,
          };
          return this.$$api.complaintSource
          .updStatus({ data: data });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.$$Toast.success("停用成功");
        })
        .catch(() => {});
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      let data = {
        ...this.queryParams,
      };
      this.$$api.complaintSource
        .listComplaintSource({
          params: data,
        })
        .then(({ res: response, err }) => {
          if (err) return;
          this.dataSource = response.rows;
          this.total = response.total;
          this.loading = false;
        });
    },
    /** 查询部门下拉树结构 */
    getTree() {
      this.$$api.complaintSource
        .listComplaintSourceTree()   
        .then(({ res: response, err }) => {
          if (err) return;
          this.deptOptions = response.list;
        });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.sourceName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if(data.level>=3) return
      this.$refs["queryForm"]?.resetFields();
      this.currentNode = data;
      this.queryParams.pcode = data.sourceCode;
      this.handleQuery();
    },
    // 用户状态修改
    // handleStatusChange(row) {
    //   let text = row.status === "0" ? "启用" : "停用";
    //   this.$$Dialog
    //     .confirm('确认要"' + text + '""' + row.sourceName + '"用户吗？')
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
        sourceName: undefined,
        sourceCode: undefined,
        oneSourceCode: undefined,
        oneSourceName: undefined,
        twoSourceCode: undefined,
        twoSourceName: undefined,
        oneSourceEdit:true,
        twoSourceEdit:true,
        threeSourceEdit:true,
        pcode: undefined,
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
      this.$refs["queryForm"]?.resetFields();
      this.queryParams.isProvinceCustom=undefined
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.sourceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.handleType = "add";
      this.getSourCode();
      this.getCurrentTreeNodeInfo(this.currentNode.sourceId);
      if(this.currentNode.level==1){
        this.form.twoSourceEdit=false
      }
      if(this.currentNode.level==2){
        this.form.threeSourceEdit=false
      }
      this.title = "投诉来源维护";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sourceId = row.sourceId;
      this.form.handleType = "edit";
      if(this.currentNode.level==1){
        this.form.twoSourceEdit=false
      }
      if(this.currentNode.level==0){
        this.form.oneSourceEdit=false
      }
      if(this.currentNode.level==2){
        this.form.threeSourceEdit=false
      }
      this.getCurrentTreeNodeInfo(sourceId);
      this.title = "修改投诉来源";
      this.open = true;
    },
    getSourCode() {
      let data = {
        pcode: this.currentNode.sourceCode,
        sourceId: this.currentNode.sourceId,
      };
      this.$$api.complaintSource
        .getComplaintSourceCode({ data })
        .then(({ res: response, err }) => {
          if (err) return;
          
          if(this.currentNode.level==1){
            this.form.twoSourceCode = response.sourceCode;
          }else{
            this.form.sourceCode = response.sourceCode;
          }  
          // this.deptOptions = response.res;
        });
    },
    getCurrentTreeNodeInfo(ID) {
      this.$$api.complaintSource
        .getComplaintSourceDetail({ sourceId: ID })
        .then(({ res: response, err }) => {
          if (err) return;
          let {
            oneSourceCode,
            oneSourceName,
            level,
            sourceId,
            twoSourceCode,
            twoSourceName,
            sourceCode,
            sourceName,
          } = { ...response };
          if(level==3){
            this.form.sourceName = sourceName;
            this.form.sourceCode = sourceCode;
            this.form.threeSourceEdit = false;
          }
          // 为1时，详情数据中twoSourceName没值，会覆盖获取的编码值
          if(level!=1){
            this.form.twoSourceCode = twoSourceCode;
            this.form.twoSourceName = twoSourceName;
          }
          this.form.sourceId = sourceId;
          this.currentNode.level = level;
          this.form.oneSourceCode = oneSourceCode;
          this.form.oneSourceName = oneSourceName;
          
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      let data = {};
      let sourceName = null;
      let sourceCode = null;
      if (this.currentNode.level == 1) {
        sourceName = this.form.twoSourceName;
        sourceCode = this.form.twoSourceCode;
      }else{
        sourceName = this.form.sourceName;
        sourceCode = this.form.sourceCode;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.handleType === "edit") {
            data = {
              sourceId:this.form.sourceId,
            };
            if(this.currentNode.level==2){
              data.sourceName= this.form.twoSourceName
            }
            if(this.currentNode.level==3){
              data.sourceName= this.form.sourceName
            }
            this.$$api.complaintSource
              .updateComplaintSource({ data:data})
              .then(({ res, err }) => {
                if (err) return;
                this.$$Toast.success("修改成功");
                this.open = false;
                this.getList();
                this.getTree();
              });
          } else {
            data = {
              sourceName: sourceName,
              sourceCode: sourceCode,
              level: this.currentNode.level + 1, //后端任启超指定的参数
              pcode: this.currentNode.sourceCode,
            };
            this.$$api.complaintSource
              .addComplaintSource({ data })
              .then(({ res, err }) => {
                if (err) return;
                this.$$Toast.success("新增成功");
                this.open = false;
                this.getList();
                this.getTree();
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const sourceId = row.sourceId || this.ids;
      this.$$Dialog
        .confirm('是否确认删除来源编号为"' + sourceId + '"的数据项？含有子节点的将会被一并删除！')
        .then(() => {
          let data = Array.isArray(sourceId)
            ? JSON.stringify(sourceId)
            : JSON.stringify([sourceId]);
          return this.$$api.complaintSource.delComplaintSource({ data });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.getTree();
          this.$$Toast.success("删除成功");
        })
        .catch(() => {});
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
</style>
