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
      <el-form-item label="标签名称" prop="tagName">
        <el-input
          v-model="queryParams.tagName"
          placeholder="请输入标签名称"
          clearable
          class="queryItem"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="标签状态"
          clearable
          class="queryItem"
        >
          <!-- <el-option
            v-for="dict in statusList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          /> -->
          <el-option
            v-for="dict in $store.getters['dictionaries/GET_DICT'](
              'start_stop'
            )"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="省" prop="provinceCode">
        <el-select
          v-model="queryParams.provinceCode"
          placeholder="省"
          clearable
          class="queryItem"
        >
          <el-option
            v-for="dict in $$dictionaries.get('sys_normal_disable')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
    <div class="one-screen-fg1"></div>
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

      <el-col :span="1.5">
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
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
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
            <el-form-item label="颜色" prop="tagColor">
              <el-color-picker v-model="form.tagColor"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签名称" prop="tagName">
              <el-input
                v-model="form.tagName"
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
import JsTable from "@/components/js-table/index.vue";
export default {
  name: "Dict",
  cusDicts: ["start_stop"],
  components: { JsTable },
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
      // statusList: [
      //   {
      //     label: "停用",
      //     value: "0",
      //   },
      //   {
      //     label: "启用",
      //     value: "1",
      //   },
      //   {
      //     label: "删除",
      //     value: "2",
      //   },
      // ],
      columns: {
        selection: true,
        props: [
          {
            name: "标签编号",
            key: "tagCode",
          },
          {
            name: "标签名称",
            key: "tagName",
          },
          {
            name: "状态",
            key: "status",
          },
          {
            name: "省",
            key: "provinceCode",
          },
          {
            name: "更新人",
            key: "createdBy",
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
        tagName: undefined,
        dictType: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tagColor: [
          { required: true, message: "标签颜色不能为空", trigger: "blur" },
        ],
        tagName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    ToDictData(row) {
      this.$router.push({ name: "DictData", params: { dictId: row.dictId } });
    },
    /** 查询标签类型列表 */
    getList() {
      this.loading = true;
      this.$$api.labelDictionary
        .listDictTag({
          params: this.queryParams,
        })
        .then(({ res: response, err }) => {
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
        tagCode: undefined,
        tagName: undefined,
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
      this.title = "标签维护";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.tagId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tDictTagId = row.tagId;
      this.$$api.labelDictionary
        .getChannelDetail({ tDictTagId: tDictTagId })
        .then(({ res: response, err }) => {
          if (err) return;
          let { tagId, tagColor, tagName } = { ...response };
          this.form = { tagId, tagColor, tagName };
          this.open = true;
          this.title = "修改标签类型";
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.tagId != undefined) {
            this.$$api.labelDictionary
              .updateDictTag({ data: this.form })
              .then(({ res: response, err }) => {
                if (err) return;
                this.$$Toast.success("修改成功");
                this.open = false;
                this.getList();
              });
          } else {
            let { tagColor, tagName } = { ...this.form };

            let data = {
              tagColor,
              tagName,
            };
            this.$$api.labelDictionary
              .addDictTag({ data: data })
              .then(({ res: response, err }) => {
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
      const tagId = row.tagId || this.ids;
      this.$$Dialog
        .confirm('是否确认删除渠道编码为"' + tagId + '"的数据项？')
        .then(() => {
          let data = {
            tDictTagIds: Array.isArray(tagId) ? tagId.join(",") : tagId,
          };
          return this.$$api.labelDictionary.delChannel(data);
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
::v-deep .el-form-item__label{
  width: 80px
}
</style>
