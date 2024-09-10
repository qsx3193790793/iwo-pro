<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--机构数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="tree_channelName"
              placeholder="请输入渠道名称"
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
              node-key="channelId"
              :default-expand-all="isExpend"
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
        <JsTable class="one-screen-fg1" :dataSource="dataSource" :columns="columns" @selectionChange="handleSelectionChange">
          <template #isProvinceCustom="{row}">
            <div>{{ row.isProvinceCustom ? '是' : '否' }}</div>
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
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body :close-on-click-modal="!1">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="渠道一级名称" prop="oneChannelName">
              <el-input
                  :disabled="!!form.oneChannelEdit"
                  v-model="form.oneChannelName"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道一级编码">
              <el-input
                  disabled
                  v-model="form.oneChannelCode"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="currentNode.channelLevel!=0">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="渠道二级名称" prop="twoChannelName">
                <el-input
                    :disabled="!!form.twoChannelEdit"
                    v-model="form.twoChannelName"
                    placeholder="请输入"
                    maxlength="30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="渠道二级编码">
                <el-input
                    disabled
                    v-model="form.twoChannelCode"
                    placeholder="请输入"
                    maxlength="30"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="currentNode.channelLevel!=1">
            <el-col :span="12">
              <el-form-item label="渠道三级名称" prop="channelName">
                <el-input
                    v-model="form.channelName"
                    placeholder="请输入"
                    maxlength="30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="渠道三级编码">
                <el-input
                    disabled
                    v-model="form.channelCode"
                    placeholder="请输入"
                    maxlength="30"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span="12">
            <el-checkbox v-model="form.customProvince" disabled>省自定义</el-checkbox>
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
  name: "ChannelClassification",
  dicts: ['start_stop', 'yes_no'],
  components: {Treeselect, JsTable, PageSearchPanel},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 渠道编码
      channelCodeList: [],
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
      tree_channelName: "",
      //树形组件是否展开
      isExpend: true,
      // 表单参数
      form: {},
      formConfigItems: [
        {
          name: "渠道编码",
          key: "channelCode",
          value: "",
          type: "input",
          placeholder: "渠道编码",
          col: 6,
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "渠道名称",
          key: "channelName",
          value: "",
          type: "input",
          placeholder: "渠道名称",
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
              attrs: {type: "primary"},
              permission: ['config:channel:query'],
              col: 1,
              onClick: ({vm}) => {
                this.getList();
              },
            },
            {
              btnName: "新增",
              type: "button",
              attrs: {type: "success", disabled: () => this.currentNode.channelLevel == 3},
              permission: ['config:channel:add'],
              col: 1,
              onClick: ({vm}) => {
                this.handleAdd()
              },
            },
            {
              btnName: '删除', type: 'button', attrs: {type: 'danger', disabled: () => !this.ids.length}, col: 1,
              permission: ['config:channel:remove'],
              onClick: ({vm}) => {
                this.handleDelete();
              }
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "channelName",
      },
      columns: {
        selection: true,
        props: [
          {
            name: "节点层级链",
            key: "channelChain",
          },
          {
            name: "渠道编码",
            key: "channelCode",
          },
          {
            name: "渠道名称",
            key: "channelName",
          },
          {
            name: "是否省自定义",
            key: "isProvinceCustom",
          },
          {
            name: "省",
            key: "provinceName",
          },
          {
            name: "状态",
            key: "status",
          },
          {
            name: "更新人",
            key: "updatedBy",
          },
          {
            name: "更新时间",
            width: 160,
            key: "updatedTime",
          },
        ],
        options: {
          btns: [
            {
              label: "修改",
              key: "edit",
              event: this.handleUpdate,
              permission: ['config:channel:edit'],
              autoHidden: this.autoHandleHidden,
            },
            {
              label: "删除",
              key: "del",
              type: "danger",
              permission: ['config:channel:remove'],
              autoHidden: this.autoHandleHidden,
              event: (val) => {
                this.handleDelete(val)
              },
            },
            {
              label: "启用",
              key: "start",
              type: "primary",
              permission: ['config:channel:edit'],
              autoHidden: this.autoStartHidden,
              event: this.handleStart,
            },
            {
              label: "停用",
              key: "end",
              type: "danger",
              permission: ['config:channel:edit'],
              autoHidden: this.autoEndHidden,
              event: this.handleEnd,
            },
          ],
        },
      },
      dataSource: [],
      currentNode: {
        channelLevel: 0,
        channelCode: '0',
        channelId: '0',
        channelName: '渠道',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        channelLevel: undefined,
        pcode: undefined,
      },
      // 表单校验
      rules: {
        // userName: [
        //   { required: true, message: "用户名称不能为空", trigger: "blur" },
        //   {
        //     min: 2,
        //     max: 20,
        //     message: "用户名称长度必须介于 2 和 20 之间",
        //     trigger: "blur",
        //   },
        // ],
        channelName: [
          {required: true, message: "渠道名称不能为空", trigger: "blur"},
        ],
        twoChannelName: [
          {required: true, message: "二级渠道名称不能为空", trigger: "blur"},
        ],
        oneChannelName: [
          {required: true, message: "一级渠道名称不能为空", trigger: "blur"},
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选机构树
    tree_channelName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  mounted() {
    this.getList();
    this.getChannelTree();
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
        return (val.row.status == '0' && val.row.isProvinceCustom != "0") ? true : false
      } else {
        return false
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return (val.row.status == '1' && val.row.isProvinceCustom != "0") ? true : false
      } else {
        return false
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      this.$$api.channelClassification
          .listChannel({
            params: {
              ...formData,
              ...this.queryParams
            }
          })
          .then(({res: response, err}) => {
            if (err) return;
            this.dataSource = response.rows;
            this.total = response.total;
            this.loading = false;
          });
    },
    /** 查询机构下拉树结构 */
    getChannelTree() {
      this.$$api.channelClassification.listChannelTree().then(({res: response, err}) => {
        if (err) return
        let data = [{
          channelLevel: 0,
          channelCode: '0',
          channelId: '0',
          channelName: '渠道',
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
      return data.channelName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // if (data.channelLevel == 3) return
      this.$refs["queryForm"]?.resetFields();
      // console.log(data, '----889')
      this.currentNode = data
      this.queryParams.pcode = data.channelCode;
      this.handleQuery();
    },
    // // 用户状态修改
    // handleStatusChange(row) {
    //   let text = row.status === "0" ? "启用" : "停用";
    //   this.$$Dialog
    //     .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
    //     .then(function () {
    //       return this.$$api.user.changeUserStatus({
    //         data: { channelCode: row.channelCode, status: row.status },
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
        oneChannelCode: undefined,
        oneChannelName: undefined,
        twoChannelCode: undefined,
        twoChannelName: undefined,
        channelName: undefined,
        channelId: undefined,
        channelCode: undefined,
        customProvince: true,
        oneChannelEdit: true,
        twoChannelEdit: true,
        threeChannelEdit: true,
        handleType: ''
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
      this.ids = selection.map((item) => item.channelId);
      this.channelCodeList = selection.map((item) => item.channelCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.handleType = 'add'
      this.getchannelCode(this.currentNode.channelCode)
      // 为0表示根路径，不需要回显一级、二级节点
      if (this.currentNode.channelLevel != 0) {
        this.getCurrentTreeNodeInfo(this.currentNode.channelId)
      }
      this.title = "渠道维护";
      this.open = true;
    },
    getchannelCode(Code) {
      let data = {
        pcode: Code
      }
      this.$$api.channelClassification.getchannelCode({data}).then(({res: response, err}) => {
        if (err) return
        if (this.currentNode.channelLevel == 0) {
          this.form.oneChannelCode = response.channelCode
          this.form.oneChannelEdit = false
        }
        if (this.currentNode.channelLevel == 1) {
          this.form.twoChannelCode = response.channelCode

        }
        if (this.currentNode.channelLevel == 2) {
          this.form.channelCode = response.channelCode

        }
      });
    },
    getCurrentTreeNodeInfo(ID) {
      this.$$api.channelClassification.getChannelDetail({channelId: ID}).then(({res: response, err}) => {
        if (err) return
        let {oneChannelCode, oneChannelName, channelName, twoChannelName, channelId, twoChannelCode, channelCode, channelLevel, isProvinceCustom} = {...response}
        this.form.oneChannelCode = oneChannelCode
        this.form.oneChannelName = oneChannelName
        this.form.channelId = channelId
        if (this.form.handleType == "edit") {
          this.form.customProvince = isProvinceCustom ? true : false
        }
        // 用于编辑时，效果等同于点击树节点（新增、编辑的逻辑就按照同一套逻辑处理）
        if (this.form.handleType == 'edit') {
          this.currentNode.channelLevel = channelLevel - 1
        }
        if (channelLevel == 1) {
          this.form.oneChannelCode = channelCode
          this.form.oneChannelName = channelName
          this.form.twoChannelEdit = false
        }
        if (channelLevel == 2) {
          this.form.twoChannelCode = channelCode
          this.form.twoChannelName = channelName
        }
        if (channelLevel == 3) {
          this.form.twoChannelCode = twoChannelCode
          this.form.twoChannelName = twoChannelName
          this.form.channelName = channelName
          this.form.channelCode = channelCode
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const channelCode = row.channelId;
      this.form.handleType = 'edit'
      this.getCurrentTreeNodeInfo(channelCode)
      if (row.channelLevel == 1) {
        this.form.oneChannelEdit = false
      }
      if (row.channelLevel == 2) {
        this.form.twoChannelEdit = false
      }
      if (row.channelLevel == 1) {
        this.form.threeChannelEdit = false
      }
      this.title = "渠道维护";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {

          if (this.form.handleType == 'edit') {
            let data = {
              channelId: this.form.channelId,
            }
            // 不同层级取值逻辑不同
            if (this.currentNode.channelLevel == 0) {
              data.channelName = this.form.oneChannelName
            }
            if (this.currentNode.channelLevel == 1) {
              data.channelName = this.form.twoChannelName
            }
            if (this.currentNode.channelLevel == 2) {
              data.channelName = this.form.channelName
            }
            this.$$api.channelClassification
                .updateChannel({data: data})
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                  this.getChannelTree();
                });
          } else {
            let data = {
              pcode: this.currentNode.channelCode,
            }
            // 不同层级取值逻辑不同
            if (this.currentNode.channelLevel == 0) {
              data.channelCode = this.form.oneChannelCode,
                  data.channelName = this.form.oneChannelName
            }
            if (this.currentNode.channelLevel == 1) {
              data.channelCode = this.form.twoChannelCode,
                  data.channelName = this.form.twoChannelName
            }
            if (this.currentNode.channelLevel == 2) {
              data.channelCode = this.form.channelCode,
                  data.channelName = this.form.channelName
            }
            this.$$api.channelClassification
                .addChannel({data: data})
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("新增成功");
                  this.open = false;
                  this.getList();
                  this.getChannelTree();
                });
          }
        }
      });
    },
    // 启用
    handleStart(row) {
      this.$$Dialog
          .confirm('是否确认启用渠道编码为"' + row.channelCode + '"的数据项？')
          .then(() => {
            let data = {
              channelId: row.channelId,
              status: 1,
            }
            return this.$$api.channelClassification.updStatus({data: data});
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
          .confirm('是否确认停用渠道编码为"' + row.channelCode + '"的数据项？')
          .then(() => {
            let data = {
              channelId: row.channelId,
              status: 0,
            }
            return this.$$api.channelClassification.updStatus({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("停用成功");
          })
          .catch(() => {
          });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const channelCodes = row?.channelId || this.ids;
      let showText = ''
      if (this.ids.length > 0 && !row?.channelId) {
        showText = this.channelCodeList.join(',')
      } else {
        showText = row?.channelCode
      }
      this.$$Dialog
          .confirm('是否确认删除渠道编码为"' + showText + '"的数据项？')
          .then(() => {

            let data = {
              channelIds: Array.isArray(channelCodes) ? channelCodes.join(',') : channelCodes
            }
            return this.$$api.channelClassification.delChannel(data);
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.getChannelTree();
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
