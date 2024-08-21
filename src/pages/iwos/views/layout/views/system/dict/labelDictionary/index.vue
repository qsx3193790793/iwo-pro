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
      <template #provinceCode="{ row }">
        <div> {{ $store.getters['dictionaries/MATCH_LABEL']('base_province_code', row.provinceCode) }}</div>
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
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';

export default {
  name: "Dict",
  cusDicts: ["start_stop", "base_province_code"],
  components: {JsTable, PageSearchPanel},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 删除时显示的标签编码
      tagcodeList: [],
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
              event: (val) => {
                this.handleDelete(val)
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
      formConfigItems: [
        {
          name: "标签名称",
          key: "tagName",
          value: "",
          type: "input",
          placeholder: "标签名称",
          col: 6,
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
              attrs: {type: "success"},
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
      // 表单校验
      rules: {
        tagColor: [
          {required: true, message: "标签颜色不能为空", trigger: "blur"},
        ],
        tagName: [
          {required: true, message: "标签名称不能为空", trigger: "blur"},
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
    autoStartHidden(val) {
      if (val.row) {
        return val.row.status == '0' ? true : false
      } else {
        return false
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return val.row.status == '1' ? true : false
      } else {
        return false
      }
    },
    // 启用
    handleStart(row) {
      this.$$Dialog
          .confirm('是否确认启用标签编码为"' + row.tagCode + '"的数据项？')
          .then(() => {
            let data = {
              tagId: row.tagId,
              status: 1,
            }
            return this.$$api.labelDictionary.updStatus({data: data});
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
          .confirm('是否确认停用标签编码为"' + row.tagCode + '"的数据项？')
          .then(() => {
            let data = {
              tagId: row.tagId,
              status: 0,
            }
            return this.$$api.labelDictionary.updStatus({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("停用成功");
          })
          .catch(() => {
          });
    },
    ToDictData(row) {
      this.$router.push({name: "DictData", params: {dictId: row.dictId}});
    },
    /** 查询标签类型列表 */
    getList() {
      this.loading = true;
      this.$$api.labelDictionary
          .listDictTag({
            params: this.queryParams,
          })
          .then(({res: response, err}) => {
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
      this.tagcodeList = selection.map((item) => item.tagCode)
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tDictTagId = row.tagId;
      this.$$api.labelDictionary
          .getChannelDetail({tDictTagId: tDictTagId})
          .then(({res: response, err}) => {
            if (err) return;
            let {tagId, tagColor, tagName} = {...response};
            this.form = {tagId, tagColor, tagName};
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
                .updateDictTag({data: this.form})
                .then(({res: response, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                });
          } else {
            let {tagColor, tagName} = {...this.form};

            let data = {
              tagColor,
              tagName,
            };
            this.$$api.labelDictionary
                .addDictTag({data: data})
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
      const tagId = row?.tagId || this.ids;
      let showText = ''
      if (this.ids.length > 0 && !row.tagId) {
        showText = this.tagcodeList.join(',')
      } else {
        showText = row?.tagCode
      }
      this.$$Dialog
          .confirm('是否确认删除标签编码为"' + showText + '"的数据项？')
          .then(() => {
            let data = {
              tDictTagIds: Array.isArray(tagId) ? tagId.join(",") : tagId,
            };
            return this.$$api.labelDictionary.delChannel(data);
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

::v-deep .el-form-item__label {
  width: 80px
}
</style>
