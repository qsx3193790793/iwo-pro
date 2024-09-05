<template>
  <div class="app-container one-screen">
    <PageSearchPanel
        class="one-screen-fg0"
        ref="PageSearchPanelRef"
        :formConfigItems="formConfigItems"
        noBackground
        style="margin-bottom: 0;"
    ></PageSearchPanel>
    <JsTable
        class="one-screen-fg1"
        :dataSource="dataSource"
        :columns="columns"
        @selectionChange="handleSelectionChange"
    >
      <template #status="{ row }">
        {{ ({0: '停用', 1: '启用', 2: '删除'})[row.status] ?? '-' }}
      </template>
      <template #dictType="{ row }">
        <div class="keyValue" @click="ToDictData(row)">{{ row.dictType }}</div>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body :close-on-click-modal="!1">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典标签" prop="dictName">
              <el-input
                  v-model="form.dictName"
                  placeholder="请输入"
                  maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典类型" prop="dictType">
              <el-input
                  v-model="form.dictType"
                  placeholder="请输入"
                  maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio v-model="form.status" label="1">正常</el-radio>
              <el-radio v-model="form.status" label="0">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                  v-model="form.remark"
                  placeholder="请输入"
                  type="textarea"
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
import dayjs from 'dayjs'
import JsTable from "@/components/js-table/index.vue";
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';

export default {
  name: "CustomDictionary",
  // dicts: ["sys_normal_disable"],
  dicts: ['start_stop'],
  components: {JsTable, PageSearchPanel},
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 标签表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态列表
      statusList: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "停用",
          value: 0,
        },
      ],
      columns: {
        selection: true,
        props: [
          {
            name: "字典编号",
            key: "dictId",
          },
          {
            name: "字典名称",
            key: "dictName",
          },
          {
            name: "字典类型",
            key: "dictType",
          },
          {
            name: "状态",
            key: "status",
            width: 80,
          },
          {
            name: "备注",
            key: "remark",
          },
          // {
          //   name: "更新人",
          //   key: "updateBy",
          // },
          {
            name: "创建时间",
            key: "createTime",
          },
        ],
        options: {
          btns: [
            {
              label: "修改",
              key: "edit",
              event: this.handleUpdate,
              permission: ['config:dictionary:update'],
            },
            {
              label: "删除",
              key: "del",
              type: "danger",
              permission: ['config:dictionary:remove'],
              event: this.handleDelete,
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
      },
      // 表单参数
      form: {},
      formConfigItems: [
        {
          name: "字典名称",
          key: "dictName",
          value: "",
          type: "input",
          placeholder: "字典名称",
          col: 4,
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "字典类型",
          key: "dictType",
          value: "",
          type: "input",
          placeholder: "字典类型",
          col: 4,
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "状态",
          key: "status",
          value: "",
          col: 4,
          type: "select",
          options: () =>
              this.$store.getters["dictionaries/GET_DICT"]("start_stop"),
          isDisable: !1,
          isRequire: !1,
        },
        {name: '创建时间', key: 'timeRange', value: '', col: 6, type: 'dateRangePicker', isDisable: !1, isRequire: !1},
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
              permission: ['config:dictionary:pageList'],
              onClick: ({vm}) => {
                this.getList();
              },
            },
            {
              btnName: '刷新缓存', type: 'button', attrs: {type: 'danger'}, col: 1,
              permission: ['config:dictionary:refreshCache'],
              onClick: ({vm}) => {
                this.handleCache();
              }
            },
            {
              btnName: "新增",
              type: "button",
              permission: ['config:dictionary:add'],
              attrs: {type: "success"},
              col: 1,
              onClick: ({vm}) => {
                this.handleAdd()
              },
            },
          ],
        },
      ],
      // 表单校验
      rules: {
        dictName: [
          {required: true, message: "字典标签不能为空", trigger: "blur"},
        ],
        dictType: [
          {required: true, message: "字典类型不能为空", trigger: "blur"},
        ],
      },
    };
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCache() {
      this.$$Dialog
          .confirm("是否确认刷新缓存？")
          .then(() => {
            return this.$$api.customDict.cacheRefresh();
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("刷新成功");
          })
          .catch(() => {
          });
    },
    ToDictData(row) {
      this.$router.push({
        name: "CustomDictionaryData",
        query: {dictType: row.dictType},
      });
    },
    /** 查询标签类型列表 */
    getList() {
      this.loading = true;
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      let data = {
        ...formData,
        ...this.queryParams
      }
      if (data.timeRange && data.timeRange.length > 0) {
        let {beginTime,endTime}={...this.$$formatELDateTimeRange(data.timeRange, ['beginTime', 'endTime'])}
        data.beginTime=beginTime
        data.endTime=endTime
      }
      delete data.timeRange
      this.$$api.customDict
          .listDictionary({params: data})
          .then(({res: response, err, total}) => {
            if (err) return (this.loading = false);
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
        dictName: undefined,
        dictType: undefined,
        status: "1",
        remark: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.dictId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let {dictName, dictType, remark, status, dictId} = {...row};
      this.form = {dictName, dictType, remark, status, dictId};
      this.form.status = this.form.status + "";
      this.title = "修改字典类型";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.dictId != undefined) {
            this.$$api.customDict
                .updateDictionary({data: this.form})
                .then(({res: response, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                });
          } else {
            this.$$api.customDict
                .addDictionary({data: this.form})
                .then(({res: response, err}) => {
                  if (err) return;
                  this.$$Toast.success("新增成功");
                  this.open = false;
                  this.getList();
                });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      // 启用状态的不能删除
      if (row.status == 1) {
        this.$$Toast.warning("当前字段状态为启用，不可以删除");
        return
      }
      this.$$Dialog
          .confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？')
          .then(() => {
            let data = {
              dictId: Array.isArray(dictIds) ? dictIds.join(",") : dictIds,
            };
            return this.$$api.customDict.delDictionary(data);
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("删除成功");
          })
          .catch(() => {
          });
    },
  },
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

.keyValue {
  color: #20a0ff;
  cursor: pointer;
}

.queryItem {
  width: 240px;
}
</style>
