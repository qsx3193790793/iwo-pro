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
      <el-form-item label="字典名称" prop="dictName">
        <el-input
            v-model="queryParams.dictName"
            placeholder="请输入字典名称"
            clearable
            class="queryItem"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
            v-model="queryParams.dictType"
            placeholder="请输入字典名称"
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
      <el-form-item label="创建时间">
        <el-date-picker
            class="queryItem"
            v-model="queryParams.rangeDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        >
        </el-date-picker>
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
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleCache"
            v-hasPermission="['system:dict:remove']"
        >刷新缓存
        </el-button>
      </el-col>
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
      <template #dictType="{ row }">
        <div class="keyValue" @click="ToDictData(row)">{{ row.dictType }}</div>
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
        dictName: [
          {required: true, message: "标签名称不能为空", trigger: "blur"},
        ],
        dictType: [
          {required: true, message: "标签类型不能为空", trigger: "blur"},
        ],
      },
    };
  },
  created() {
    this.getList();
    this.$nextTick(() => this.$refs.table?.doLayout());
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
      let data = {
        ...this.queryParams
      }
      if (data.rangeDate && data.rangeDate.length > 0) {
        data.beginTime = dayjs(new Date(data.rangeDate[0]).getTime()).format('YYYY-MM-DD HH:mm:ss')
        data.endTime = dayjs(new Date(data.rangeDate[1]).getTime()).format('YYYY-MM-DD HH:mm:ss')
        delete data.rangeDate
      }
      console.log(data, '---888')
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
      this.queryParams.rangeDate = []
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
      this.$$Dialog
          .confirm('是否确认删除标签编号为"' + dictIds + '"的数据项？')
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
