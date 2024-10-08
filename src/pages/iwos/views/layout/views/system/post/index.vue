<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="queryParams.postCode" placeholder="请输入岗位编码" clearable maxlength="30" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="queryParams.postName" placeholder="请输入岗位名称" clearable maxlength="30" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>
          <el-option v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
        <el-button type="success" size="small" @click="handleAdd" v-hasPermission="['system:post:add']">新增</el-button>
        <el-button type="danger" size="small" :disabled="multiple" @click="handleDelete" v-hasPermission="['system:post:remove']">删除</el-button>
        <el-button type="warning" size="small" @click="handleExport" v-hasPermission="['system:post:export']">导出</el-button>

      </el-form-item>
    </el-form>

    <el-table v-loading="loading" class="one-screen-fg1" height="100%" ref="table" :data="postList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="岗位编号" align="center" prop="postId"/>
      <el-table-column label="岗位编码" align="center" prop="postCode"/>
      <el-table-column label="岗位名称" align="center" prop="postName"/>
      <el-table-column label="岗位排序" align="center" prop="postSort"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable', row.status) }}
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
      >
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)" v-hasPermission="['system:post:edit']">修改</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-hasPermission="['system:post:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>

    <!-- 添加或修改岗位对话框 -->
    <MDialog  v-model="open" :title="title" width="5rem">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" maxlength="30"/>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入编码名称" maxlength="30"/>
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number
              v-model="form.postSort"
              controls-position="right"
              :min="0"
          />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </MDialog>
  </div>
</template>

<script>
import MDialog from '@/components/MDialog';
export default {
  name: "PostIndex",
  dicts: ["sys_normal_disable"],
  components: {MDialog},
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
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        postCode: undefined,
        postName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        postName: [
          {required: true, message: "岗位名称不能为空", trigger: "blur"},
        ],
        postCode: [
          {required: true, message: "岗位编码不能为空", trigger: "blur"},
        ],
        postSort: [
          {required: true, message: "岗位顺序不能为空", trigger: "blur"},
        ],
      },
    };
  },
  created() {
    this.getList();
    this.loading = false;
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      this.$$api.post.listpost({params: this.queryParams}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.postList = response.rows;
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
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "1",
        remark: undefined,
      };
      this.$$resetForm("form", this.$refs);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs['queryForm']?.resetFields();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.postId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加岗位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids;
      this.$$api.post.getPost({postId: postId}).then(({res, err}) => {
        if (err) return
        this.form = res;
        this.open = true;
        this.title = "修改岗位";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.postId != undefined) {
            this.$$api.post.updatePost({data: this.form}).then(({res: response, err}) => {
              if (err) return
              this.$$Toast.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$$api.post.addPost({data: this.form}).then(({res: response, err}) => {
              if (err) return
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
      const postIds = row.postId || this.ids;
      this.$$Dialog.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(() => {
        return this.$$api.post.delPost({postId: postIds});
      }).then(({res, err}) => {
        if (err) return
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */ async handleExport() {
      const {res, err} = await this.$$api.post.export({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `岗位管理_${new Date().getTime()}.xlsx`);
      // this.download(
      //     "system/post/export",
      //     {
      //       ...this.queryParams,
      //     },
      //     `post_${new Date().getTime()}.xlsx`
      // );
    },
  },
};
</script>
