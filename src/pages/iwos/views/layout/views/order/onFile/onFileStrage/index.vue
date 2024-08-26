<template>
  <div class="one-screen">
    <PageSearchPanel
      ref="PageSearchPanelRef"
      :formConfigItems="formConfigItems"
    ></PageSearchPanel>
    <div class="table-panel one-screen-fg1">
      <JsTable
        :dataSource="dataSource"
        :columns="columns"
        @selectionChange="handleSelectionChange"
      >
        <template #isProvinceCustom="{ row }">
          <div>{{ row.isProvinceCustom ? "自定义" : "否" }}</div>
        </template>
        <template #orderType="{ row }">
          {{
            $store.getters["dictionaries/MATCH_LABEL"](
              "search_order_type",
              row.orderType
            )
          }}
        </template>
        <template #provinceCode="scope">
          {{
            $store.getters["dictionaries/MATCH_LABEL"](
              "base_province_code",
              scope.row.provinceCode
            )
          }}
        </template>
        <template #status="{ row }">
          <div v-show="row.status == 0">
            <el-tag type="danger">停用</el-tag>
          </div>
          <div v-show="row.status == 1"><el-tag>启用</el-tag></div>
          <div v-show="row.status == 2">
            <el-tag type="danger">删除</el-tag>
          </div>
        </template>
      </JsTable>
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
    </div>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工单类型" prop="orderType">
              <el-select
                v-model="form.orderType"
                placeholder="请选择工单类型"
                clearable
                class="queryItem"
              >
                <el-option
                  v-for="dict in $store.getters['dictionaries/GET_DICT'](
                    'search_order_type'
                  )"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="投诉来源">
              <treeselect
                v-model="form.complaintSource"
                :options="sourceTree"
                :show-count="true"
                placeholder="请选择投诉来源"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="归档时长" prop="archiveTime">
              <el-input-number
                v-model="form.archiveTime"
                :min="0"
                :max="168"
              ></el-input-number>
              <span class="unit">(小时)</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="满意度">
              <el-select
                v-model="form.satisfied"
                placeholder="请选择满意度"
                clearable
                class="queryItem"
              >
                <el-option label="满意" value="满意" />
                <el-option label="不满意" value="不满意" />
              </el-select>
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
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
export default {
  name: "UserIndex",
  cusDicts: [
    "start_stop",
    "search_order_type",
    "base_province_code",
  ],
  components: { Treeselect, JsTable, PageSearchPanel },
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
      //投诉来源树
      complaint_source_tree: [],
      // 表单参数
      form: {},
      formConfigItems: [
        {
          name: "工单类型",
          key: "orderType",
          value: "",
          col: 6,
          type: "select",
          options: () =>
            this.$store.getters["dictionaries/GET_DICT"]("search_order_type"),
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "投诉来源",
          key: "complaintSource",
          value: "",
          col: 6,
          type: "cascader",
          options: () => this.complaint_source_tree,
          attrs: { props: { checkStrictly: !0 } },
          isDisable: !1,
          isRequire: !1,
        },
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
              attrs: { type: "" },
              col: 1,
              onClick: ({ vm }) => {
                vm.resetFormData();
                this.resetQuery();
              },
            },
            {
              btnName: "查询",
              type: "button",
              attrs: { type: "primary" },
              col: 1,
              onClick: ({ vm }) => {
                this.getList();
              },
            },
            {
              btnName: "删除",
              type: "button",
              attrs: { type: "danger", disabled: () => !this.ids.length },
              col: 1,
              onClick: ({ vm }) => {
                this.handleDelete();
              },
            },
            {
              btnName: "新增",
              type: "button",
              attrs: { type: "success" },
              col: 1,
              onClick: ({ vm }) => {
                this.getSourceTree();
                this.handleAdd();
              },
            },
          ],
        },
      ],
      columns: {
        selection: true,
        props: [
          {
            name: "工单类型",
            key: "orderType",
          },
          {
            name: "投诉来源",
            key: "sourceName",
          },
          {
            name: "归档时长(小时)",
            key: "archiveTime",
          },
          {
            name: "满意度",
            key: "satisfied",
          },
          {
            name: "省",
            key: "provinceCode",
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
            width: 130,
            key: "updatedTime",
          },
        ],
        options: {
          btns: [
            {
              label: "编辑",
              key: "edit",
              event: (val) => {
                this.handleUpdate(val);
                this.getSourceTree();
              },
            },
            {
              label: "删除",
              key: "del",
              type: "danger",
              event: (val) => {
                this.handleDelete(val);
              },
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
      // 投诉来源的数据
      sourceTree: [],
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
        orderType: [
          {
            required: true,
            message: "工单类型不能为空",
            trigger: ["change", "submit"],
          },
        ],
        archiveTime: [
          {
            required: true,
            message: "归档时长不能为空",
            trigger: ["blur", "submit"],
          },
        ],
      },
    };
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  mounted() {
    this.getList();
    this.listComplaintSourceTree();
  },
  methods: {
    //投诉来源下拉菜单
    listComplaintSourceTree() {
      this.$$api.complaintSource
        .listComplaintSourceTree({
          data: { status: 1 },
        })
        .then((res, err) => {
          if (err) return;
          this.complaint_source_tree = this.$$formatCascaderTree(
            res?.res.list || [],
            "sourceName",
            "sourceCode",
            "children"
          );
        });
    },
    /** 查询机构下拉树结构 */
    getSourceTree() {
      this.$$api.complaintSource
        .listComplaintSourceTree({ data: { status: 1 } })
        .then(({ res, err }) => {
          if (err) return;
          this.sourceTree = res?.list || [];
        });
    },
    /** 转换班组数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.sourceCode,
        label: node.sourceName,
        children: node.children,
      };
    },
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
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      let copyData = JSON.parse(JSON.stringify(formData));
      if (copyData?.complaintSource && copyData?.complaintSource.length > 0) {
        copyData.complaintSource =
          copyData.complaintSource[copyData.complaintSource.length - 1];
      }
      this.$$api.complaint
        .listOnFileStrategy({
          params: {
            ...copyData,
            ...this.queryParams,
          },
        })
        .then(({ res: response, err }) => {
          if (err) return;
          this.dataSource = response.rows;
          this.total = response.total;
          this.loading = false;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orderType: undefined,
        complaintSource: undefined,
        archiveRuleId: undefined,
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.archiveRuleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "新建归档策略";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getDetail(row.archiveRuleId);
      this.title = "修改归档策略";
      this.open = true;
    },
    // 获取详情数据
    getDetail(archiveRuleId) {
      this.loading = true;
      this.$$api.complaint
        .detailOnFileStrategy({
          archiveRuleId,
        })
        .then(({ res: response, err }) => {
          if (err) return;
          let {
            archiveRuleId,
            archiveTime,
            complaintSource,
            orderType,
            satisfied,
          } = { ...response };
          this.form = {
            archiveRuleId,
            archiveTime: Number(archiveTime),
            complaintSource,
            orderType,
            satisfied,
          };
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.archiveRuleId) {
            let data = {
              ...this.form,
            };

            this.$$api.complaint
              .updataOnFileStrategy({ data: data })
              .then(({ res, err }) => {
                if (err) return;
                this.$$Toast.success("修改成功");
                this.open = false;
                this.getList();
              });
          } else {
            let data = {
              ...this.form,
            };
            this.$$api.complaint
              .addOnFileStrategy({ data: data })
              .then(({ res, err }) => {
                if (err) return;
                this.$$Toast.success("新增成功");
                this.open = false;
                this.getList();
              });
          }
        }
      });
    },
    // 启用
    handleStart(row) {
      this.$$Dialog
        .confirm("是否确认启用当前归档策略？")
        .then(() => {
          let data = {
            archiveRuleId: row.archiveRuleId,
            status: 1,
          };
          return this.$$api.complaint.statusOnFileStrategy({ data: data });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.$$Toast.success("启用成功");
        })
        .catch(() => {});
    },
    // 停用
    handleEnd(row) {
      this.$$Dialog
        .confirm("是否确认停用当前归档策略？")
        .then(() => {
          let data = {
            archiveRuleId: row.archiveRuleId,
            status: 0,
          };
          return this.$$api.complaint.statusOnFileStrategy({ data: data });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
          this.$$Toast.success("停用成功");
        })
        .catch(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const archiveRuleIds = row?.archiveRuleId || this.ids;
      this.$$Dialog
        .confirm("是否确认删除归档策略的数据项？")
        .then(() => {
          let data = {
            ruleIdList: Array.isArray(archiveRuleIds)
              ? archiveRuleIds
              : [archiveRuleIds],
          };
          return this.$$api.complaint.delteOnFileStrategy({
            data: data.ruleIdList,
          });
        })
        .then(({ res, err }) => {
          if (err) return;
          this.getList();
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
  width: 100%;
}
.unit {
  margin-left: 5px;
}
</style>
