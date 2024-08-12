<template>
  <div class="app-container one-screen">
    <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="auto"
    >
      <el-form-item label="字典名称">
        <el-select
            v-model="queryParams.dictType"
            placeholder="字典类型"
            clearable
            class="queryItem"
            @change="setNewTypeValue"
        >
          <el-option
              v-for="dict in typeList"
              :key="dict.dictType"
              :label="dict.dictName"
              :value="dict.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签">
        <el-input
            v-model="queryParams.dictLabel"
            placeholder="请输入字典标签"
            clearable
            class="queryItem"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-checkbox v-model="queryParams.phonenumber">是否默认</el-checkbox> -->
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="状态"
            clearable
            class="queryItem"
        >
          <el-option
              v-for="dict in statusList"
              :key="dict.value"
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
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermission="['system:dict:add']"
        >新增
        </el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermission="['system:dict:remove']"
          >删除
        </el-button>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
    <JsTable
        :dataSource="dataSource"
        :columns="columns"
        @selectionChange="handleSelectionChange"
    >
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
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="字典类型">
              <el-input
                  v-model="form.dictType"
                  placeholder="请输入"
                  maxlength="50"
                  disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="数据标签" prop="dictLabel">
              <el-input
                  v-model="form.dictLabel"
                  placeholder="请输入"
                  maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="数据键值" prop="dictValue">
              <el-input
                  v-model="form.dictValue"
                  placeholder="请输入"
                  maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="样式属性">
              <el-input
                  v-model="form.listClass"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="显示排序">
              <el-input-number
                  v-model="form.dictSort"
                  :min="0"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="回显样式">
              <el-select
                  v-model="form.cssClass"
                  placeholder="状态"
                  clearable
                  style="width: 100%"
              >
                <el-option
                    v-for="dict in styleArrtList"
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
import JsTable from "@/components/js-table/index.vue";

export default {
  name: "Dict",
  // dicts: ["sys_normal_disable"],
  components: {JsTable},
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型列表
      typeList: [],
      //当前操作数据的类型
      currentType: null,
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
      styleArrtList: [
        {
          label: "默认(default)",
          value: "default",
        },
        {
          label: "主要(primary)",
          value: "primary",
        },
        {
          label: "成功(success)",
          value: "success",
        },
        {
          label: "信息(info)",
          value: "info",
        },
        {
          label: "警告(warning)",
          value: "warning",
        },
        {
          label: "危险(danger)",
          value: "danger",
        },
      ],
      columns: {
        selection: true,
        props: [
          {
            name: "字典编码",
            key: "dictItemId",
          },
          {
            name: "字典标签",
            key: "dictLabel",
          },
          {
            name: "字典键值",
            key: "dictValue",
          },
          {
            name: "字典排序",
            key: "dictSort",
          },
          {
            name: "状态",
            key: "status",
          },
          {
            name: "备注",
            key: "remark",
          },
          //   {
          //     name: "字典类型",
          //     key: "dictType",
          //   },
          //   {
          //     name: "式样属性",
          //     key: "listClass",
          //   },
          //   {
          //     name: "表格回显式样",
          //     key: "cssClass",
          //   },
          //   {
          //     name: "是否默认",
          //     key: "isDefault",
          //   },

          //   {
          //     name: "更新人",
          //     key: "updateName",
          //   },
          {
            name: "创建时间",
            key: "createTime",
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
        dictName: undefined,
        dictType: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          {required: true, message: "数据标签不能为空", trigger: "blur"},
        ],
        dictValue: [
          {required: true, message: "数据键值不能为空", trigger: "blur"},
        ],
        dictSort: [
          {required: true, message: "显示排序不能为空", trigger: "blur"},
        ],
      },
    };
  },
  created() {
    this.currentType = this.$route.query.dictType
    this.queryParams.dictType = this.currentType;
    this.getList();
    this.getTypeLsit();
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    setNewTypeValue(val) {
      this.currentType = val
      this.getList();
    },
    getTypeLsit() {
      this.$$api.customDict
          .DictionaryTypeOptions()
          .then(({res: response, err, total}) => {
            if (err) return;
            this.typeList = response.dataList;
          });
    },
    /** 查询标签类型列表 */
    getList() {
      this.loading = true;
      this.$$api.customDict
          .listDictionaryData({params: this.queryParams})
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
        dictId: undefined,
        dictLabel: undefined,
        dictType: undefined,
        dictValue: undefined,
        listClass: undefined,
        dictSort: 0,
        cssClass: undefined,
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
      this.queryParams.dictLabel = "";
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.dictType = this.currentType;
      this.open = true;
      this.title = "自定义字典维护";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.dictItemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let {
        dictLabel,
        dictType,
        status,
        remark,
        dictValue,
        listClass,
        dictSort,
        cssClass,
        dictItemId,
      } = {...row};
      this.form = {
        dictLabel,
        dictType,
        status,
        remark,
        dictValue,
        listClass,
        dictSort,
        cssClass,
        dictItemId,
      };
      this.form.status += "";
      this.open = true;
      this.title = "修改标签类型";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.dictItemId != undefined) {
            this.$$api.customDict
                .updateDictionaryData({data: this.form})
                .then(({res: response, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                });
          } else {
            this.$$api.customDict
                .addDictionaryData({data: this.form})
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
      const dictItemIds = row.dictItemId || this.ids;
      this.$$Dialog
          .confirm('是否确认删除标签编号为"' + dictItemIds + '"的数据项？')
          .then(() => {
            let data = {
              dictItemId: Array.isArray(dictItemIds) ? dictItemIds.join(',') : dictItemIds
            }
            return this.$$api.customDict.delDictionaryData(data);
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

.queryItem {
  width: 240px;
}
</style>
