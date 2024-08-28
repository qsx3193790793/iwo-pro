<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="noticeTitle">
        <el-input
            class="queryItem"
            v-model="queryParams.noticeTitle"
            placeholder="请输入标题"
            clearable
            maxlength="30"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="createBy">
        <el-input
            class="queryItem"
            v-model="queryParams.createBy"
            placeholder="请输入操作人员"
            clearable
            maxlength="30"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable class="queryItem">
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_notice_type')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" size="small" @click="handleQuery">搜索</el-button>
        <el-button
            type="success"
            size="small"
            @click="handleAdd"
            v-hasPermission="['system:notice:add']"
        >新增
        </el-button>
        <el-button
            type="success"
            size="small"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermission="['system:notice:edit']"
        >修改
        </el-button>
        <el-button
            type="danger"
            size="small"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermission="['system:notice:remove']"
        >删除
        </el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8 one-screen-fg0">
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">

      </el-col>
    </el-row> -->

    <el-table v-loading="loading" class="one-screen-fg1" height="100%" :data="noticeList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!-- <el-table-column label="序号" align="center" prop="noticeId" width="100"/> -->
      <el-table-column
          label="标题"
          align="center"
          prop="noticeTitle"
          :show-overflow-tooltip="true"
      />
      <el-table-column label="公告类型" align="center" prop="noticeType" width="100">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_notice_type', row.noticeType) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_notice_status', row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" width="100"/>
      <el-table-column label="发布部门" align="center" prop="publishDeptName" width="100"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermission="['system:notice:edit']"
          >修改
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermission="['system:notice:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择公告类型" style="width: 100%;">
                <el-option
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_notice_type')"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入标题" maxlength="30"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_notice_status')"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="接收者类型">
              <el-radio-group v-model="form.recipientType"  @change="recipientTypeChange">
                <!-- <el-radio
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_notice_status')"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio> -->
                <el-radio
                    v-for="dict in [{value:'1', label:'机构'},{value:'2', label:'班组'}]"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收机构" prop="deptId">
              <treeselect v-model="form.deptId" :multiple="form.recipientType==='1'" :options="deptOptions" :show-count="true" placeholder="请选择机构" @select="handelDeptIdChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.recipientType!=='1'">
            <el-form-item :label="`接收${recipientLabel}`" prop="recipientIds">
              <treeselect v-model="form.recipientIds" noOptionsText='该机构下无数据' :multiple="true" :normalizer="normalizer" :options="recipientOptions" :show-count="true" :placeholder="`请选择${recipientLabel}`"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.noticeContent" ref="editorRef" :min-height="192"/>
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
import Editor from '@/components/Editor.vue';
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "NoticeIndex",
  dicts: ['sys_notice_status', 'sys_notice_type'],
  components: {Editor, Treeselect},
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
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      deptOptions: [],
      recipientOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // noticeText:'',
      // 表单校验
      rules: {
        noticeTitle: [
          {required: true, message: "标题不能为空", trigger: "blur"}
        ],
        noticeType: [
          {required: true, message: "公告类型不能为空", trigger: "change"}
        ],
        deptId: [
          {required: true, message: "接收机构不能为空", trigger: "change"}
        ],
        recipientIds: [
          {required: true, message: `接收班组不能为空`, trigger: "change"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDeptTree()
  },
  computed: {
    recipientLabel() {
      switch (this.form.recipientType) {
        case '1':
          return '机构'
        case '2':
          return '班组'
        // case '3':
        //   return '人员'
        default:
          return '机构'
      }
    }
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      this.$$api.notice.listNotice({params: this.queryParams}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    recipientTypeChange(val){
      this.form.deptId= undefined
      if (val=='2'){
        this.form.recipientIds= []
        this.recipientOptions=[]
      }  
    },
    //查询机构树
    getDeptTree() {
      this.$$api.user.deptTreeSelect().then(({res, err}) => {
        if (err) return;
        this.deptOptions = res?.list || [];
      });
    },
    handelDeptIdChange({id}) {
      if (this.form.recipientType === '2') {
        this.$$api.team.getDeptTeamTree({deptId: id}).then(({res, err}) => {
          if (err) return;
          this.form.recipientIds= []
          this.recipientOptions = res?.rows || [];
        });
      } 
      // else if (this.form.recipientType === '3') {
      //   this.$$api.user.deptTreeSelect().then(({res, err}) => {
      //     if (err) return;
      //     this.recipientOptions = res?.list || [];
      //   });
      // }
    },
    /** 转换班组数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.teamId,
        label: node.teamName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        deptId: undefined,
        recipientIds:undefined,
        recipientType: '1'
      };
      this.$refs['form']?.resetFields();
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
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      this.$$api.notice.getNotice({noticeId: noticeId}).then(({res: response, err}) => {
        if (err) return
        this.form = response;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recipientType == "1") {
            this.form.recipientIds = this.form.deptId
          }
          if (this.form.noticeId != undefined) {
           console.log('this.$refs.editorRef.getText()',this.$refs.editorRef.getText());
            this.$$api.notice.updateNotice({data: { ...this.form,noticeText: this.$refs.editorRef.getText()}}).then(({res: response, err}) => {
              if (err) return
              this.$$Toast.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$$api.notice.addNotice({data: {...this.form,noticeText: this.$refs.editorRef.getText()}}).then(({res: response, err}) => {
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
      const noticeIds = row.noticeId || this.ids
      this.$$Dialog.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(() => {
        return this.$$api.notice.delNotice({noticeId: noticeIds});
      }).then(({res: response, err}) => {
        if (err) return
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
    // getNoticeText(val){
    //    this.noticeText = val.replace(/\n/g, "")
    //    console.log('this.noticeText',this.noticeText)
    // },
    chooseRecipient() {

    }
  }
};
</script>
<style scoped lang="scss">
.queryItem {
  width: 240px;
}
</style>
