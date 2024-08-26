<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--机构数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="tree_sourceName"
              placeholder="请输入投诉来源名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container nodeTree one-screen-fg1 search_tree">
          <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              default-expand-all
              :highlight-current="true"
              @node-click="handleNodeClick"
          />
        </div>
      </div>
      <!--用户数据-->
      <div class="one-screen one-screen-fg1">
        <PageSearchPanel
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
        <template #isProvinceCustom="{row}">
            <div>{{ row.isProvinceCustom ? '是' : '否' }}</div>
          </template>
          <template #status="{ row }">
            <div v-show="row.status == 0">
              <el-tag type="danger">停用</el-tag>
            </div>
            <div v-show="row.status == 1">
              <el-tag>启用</el-tag>
            </div>
            <div v-show="row.status == 2">
              <el-tag type="danger">删除</el-tag>
            </div>
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
                  disabled
                  v-model="form.oneSourceCode"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
            :gutter="20"
            v-if="
            form.level > 1 ||
            (form.level == 1 && form.handleType == 'add')
          "
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
                  disabled
                  v-model="form.twoSourceCode"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
            :gutter="20"
            v-if="
            form.level == 3 ||
            (form.level == 2 && form.handleType == 'add')
          "
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
                  disabled
                  v-model="form.sourceCode"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-checkbox v-model="form.customProvince" disabled>是否省自定义</el-checkbox>
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
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';

export default {
  name: "UserIndex",
  cusDicts: ["start_stop", "yes_no"],
  components: {Treeselect, JsTable, PageSearchPanel},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 来源编码
      sourceCodeList: [],
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
      // 树筛选项
      tree_sourceName: "",
      // 表单参数
      form: {},
      formConfigItems: [
        {
          name: "投诉来源名称",
          key: "sourceName",
          value: "",
          type: "input",
          placeholder: "投诉来源名称",
          col: 6,
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "投诉来源编码",
          key: "sourceCode",
          value: "",
          type: "input",
          placeholder: "投诉来源编码",
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
        { col: 6, type: "divider-empty" },
        { col: 6, type: "divider-empty" },
        { col: 6, type: "divider-empty" },
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
              attrs: {type: "primary"},
              col: 1,
              onClick: ({vm}) => {
                this.getList();
              },
            },
            {
              btnName: "新增",
              type: "button",
              attrs: {
                type: "success", disabled: () => {
                  return this.currentNode.level === 3 || this.currentNode.level === 0;
                }
              },
              col: 1,
              onClick: ({vm}) => {
                this.handleAdd()
              },
            },
            {
              btnName: '删除', type: 'button', attrs: {type: 'danger', disabled: () => !this.ids.length}, col: 1,
              onClick: ({vm}) => {
                this.handleDelete();
              }
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "sourceName",
      },
      columns: {
        selection: true,
        props: [
          {
            name: "节点层级链",
            key: "sourceChain",
          },
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
            name: "是否省自定义",
            key: "isProvinceCustom",
          },
          {
            name: "更新人",
            key: "updatedBy",
          },
          {
            name: "更新时间",
            key: "updatedTime",
          },
        ],
        options: {
          btns: [
            {
              label: "编辑",
              key: "edit",
              event: this.handleUpdate,
              autoHidden: this.autoHandleHidden,
            },
            {
              label: "删除",
              key: "del",
              type: "danger",
              autoHidden: this.autoHandleHidden,
              event: (val) => {
                this.handleDelete(val)
              }
            },
            {
              label: "启用",
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
        level: 0,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
      },
      // 表单校验
      rules: {
        sourceName: [
          {required: true, message: "用户名称不能为空", trigger: "blur"},
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
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  mounted() {
    this.getList();
    this.getTree();
  },
  methods: {
    autoHandleHidden(val) {
      if (val.row) {
        return  val.row.isProvinceCustom  != "0" ? true : false;
      } else {
        return false;
      }
    },
    autoStartHidden(val) {
      if (val.row) {
        return (val.row.status == "0" && val.row.isProvinceCustom  != "0")? true : false;
      } else {
        return false;
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return (val.row.status == "1"  && val.row.isProvinceCustom  != "0")? true : false;
      } else {
        return false;
      }
    },
    // 启用
    handleStart(row) {
      this.$$Dialog
          .confirm('是否确认启用来源编码为"' + row.sourceCode + '"的数据项？')
          .then(() => {
            let data = {
              sourceId: row.sourceId,
              status: 1,
            };
            return this.$$api.complaintSource.updStatus({data: data});
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
          .confirm('是否确认停用来源编码为"' + row.sourceCode + '"的数据项？')
          .then(() => {
            let data = {
              sourceId: row.sourceId,
              status: 0,
            };
            return this.$$api.complaintSource.updStatus({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("停用成功");
          })
          .catch(() => {
          });
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      let data = {
        ...formData,
        ...this.queryParams,
      };
      this.$$api.complaintSource
          .listComplaintSource({
            params: data,
          })
          .then(({res: response, err}) => {
            if (err) return;
            this.dataSource = response.rows;
            this.total = response.total;
            this.loading = false;
          });
    },
    /** 查询投诉来源树结构 */
    getTree() {
      this.$$api.complaintSource
          .listComplaintSourceTree()
          .then(({res: response, err}) => {
            if (err) return;
            let data = [{
              level: 0,
              sourceCode: '0',
              sourceId: '0',
              sourceName: '投诉来源',
              children: response.list
            }]
            this.deptOptions = data;
          });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.sourceName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.level >= 3) return;
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
        oneSourceEdit: true,
        twoSourceEdit: true,
        threeSourceEdit: true,
        customProvince: true,
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
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.sourceId);
      this.sourceCodeList = selection.map((item) => item.sourceCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.handleType = "add";
      this.getSourCode();
      this.getCurrentTreeNodeInfo(this.currentNode.sourceId);
      this.form.level=this.currentNode.level
      if (this.currentNode.level == 1) {
        this.form.twoSourceEdit = false;
      }
      if (this.currentNode.level == 2) {
        this.form.threeSourceEdit = false;
      }
      this.title = "投诉来源维护";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sourceId = row.sourceId;
      this.form.handleType = "edit";
      if (row.level == 1) {
        this.form.oneSourceEdit = false;
      }
      if (row.level == 0) {
        this.form.oneSourceEdit = false;
      }
      if (row.level == 2) {
        this.form.twoSourceEdit = false;
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
          .getComplaintSourceCode({data})
          .then(({res: response, err}) => {
            if (err) return;

            if (this.currentNode.level == 1) {
              this.form.twoSourceCode = response.sourceCode;
            } else {
              this.form.sourceCode = response.sourceCode;
            }
            // this.deptOptions = response.res;
          });
    },
    getCurrentTreeNodeInfo(ID) {
      this.$$api.complaintSource
          .getComplaintSourceDetail({sourceId: ID})
          .then(({res: response, err}) => {
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
              isProvinceCustom
            } = {...response};
            if(this.form.handleType == "edit"){
              this.form.customProvince = isProvinceCustom?true:false
            }
            if (level == 3) {
              this.form.sourceName = sourceName;
              this.form.sourceCode = sourceCode;
              this.form.threeSourceEdit = false;
            }
            // 为1时，详情数据中twoSourceName没值，会覆盖获取的编码值
            if (level != 1) {
              this.form.twoSourceCode = twoSourceCode;
              this.form.twoSourceName = twoSourceName;
            }
            this.form.sourceId = sourceId;  
            this.form.level = level
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
      } else {
        sourceName = this.form.sourceName;
        sourceCode = this.form.sourceCode;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.handleType === "edit") {
            data = {
              sourceId: this.form.sourceId,
            };
            if (this.form.level == 2) {
              data.sourceName = this.form.twoSourceName;
            }
            if (this.form.level == 3) {
              data.sourceName = this.form.sourceName;
            }
            this.$$api.complaintSource
                .updateComplaintSource({data: data})
                .then(({res, err}) => {
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
                .addComplaintSource({data})
                .then(({res, err}) => {
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
      const sourceId = row?.sourceId || this.ids;
      let showText = ''
      if (this.ids.length > 0 &&!row.sourceId) {
        showText = this.sourceCodeList.join(',')
      } else {
        showText = row?.sourceCode
      }
      this.$$Dialog
          .confirm(
              '是否确认删除来源编号为"' +
              showText +
              '"的数据项？含有子节点的将会被一并删除！'
          )
          .then(() => {
            let data = Array.isArray(sourceId)
                ? JSON.stringify(sourceId)
                : JSON.stringify([sourceId]);
            return this.$$api.complaintSource.delComplaintSource({data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.getTree();
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

</style>
