<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--机构数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="deptName"
              placeholder="请输入机构名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
          >
          <template slot="append">
              <el-button type="primary" @click="handleCheckedTreeExpand">{{ isExpend ? '折叠' : '展开' }}</el-button>
          </template>
        </el-input>
        </div>
        <div class="head-container one-screen-fg1 search_tree" style="overflow: scroll;">
          <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              :default-expand-all="isExpend"
              :highlight-current='true'
              @node-click="handleNodeClick"
          />
        </div>
      </div>
      <!--用户数据-->
      <div class="one-screen one-screen-fg1">
        <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用户账号" prop="userName">
            <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户账号"
                clearable
                maxlength="30"
                class="queryItem"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户名称" prop="nickName">
            <el-input
                v-model="queryParams.nickName"
                placeholder="请输入用户名称"
                clearable
                maxlength="30"
                class="queryItem"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
                v-model="queryParams.phonenumber"
                placeholder="请输入手机号码"
                clearable
                class="queryItem"
                maxlength="30"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                class="queryItem"
            >
              <el-option
                  v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
                  v-bind="dict" :key="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
                v-model="dateRange"
                class="queryItem"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="resetQuery"  v-hasPermission="['system:user:query']">重置</el-button>
            <el-button type="primary" size="small" @click="handleQuery" v-hasPermission="['system:user:query']">查询</el-button>
            <el-button type="success" size="small" @click="handleAdd" v-hasPermission="['system:user:add']">新增</el-button>
            <!-- <el-button type="danger" plain size="small" :disabled="multiple" @click="handleDelete" v-hasPermission="['system:user:remove']">删除</el-button> -->
            <el-button type="info" plain size="small" @click="handleImport" v-hasPermission="['system:user:import']">导入</el-button>
            <el-button type="warning" plain size="small" @click="handleExport" v-hasPermission="['system:user:export']">导出</el-button>
            <el-dropdown trigger="click" @command="(command) => handleBatchClick(command)" v-hasPermission="['system:user:edit','system:user:remove']" :disabled="multiple">
              <el-button type="danger" size="small" class="dropdownBtn" :disabled="multiple">
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="begin" v-hasPermission="['system:user:edit']">批量启用</el-dropdown-item>
                <el-dropdown-item command="end" v-hasPermission="['system:user:edit']">批量停用</el-dropdown-item>
                <el-dropdown-item command="delete" v-hasPermission="['system:user:remove']">批量删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" class="one-screen-fg1" height="100%" :data="userList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <!-- <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible"/> -->
          <el-table-column label="用户账号" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true"/>
          <el-table-column label="用户名称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true"/>
          <el-table-column label="机构" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true"/>
          <el-table-column label="班组" align="center" key="teamName" prop="teamName" v-if="columns[7].visible" :show-overflow-tooltip="true"/>
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120"/>
          <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
            <template slot-scope="scope">
              {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable', scope.row.status) }}
              <!-- <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
              ></el-switch> -->
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template slot-scope="scope">
              <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              align="center"
              width="220"
              class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button size="small" type="primary" @click="handleUpdate(scope.row)" v-hasPermission="['system:user:edit']">修改</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-hasPermission="['system:user:remove']">删除</el-button>
              <el-dropdown v-hasPermission="['system:user:edit']" class="public-el-dropdown" trigger="click">
                <el-button type="primary">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="table-dropdown-menu">
                  <div class="inner">
                    <el-button v-hasPermission="['system:user:edit']" type="primary" size="small" @click="handleResetPwd(scope.row)">重置密码</el-button>
                    <el-button v-hasPermission="['system:user:query']" type="primary" size="small" @click="handleAuthRole(scope.row)">查看角色</el-button>
                    <el-button v-hasPermission="['system:user:edit']" v-show="scope.row.status=='0'" type="primary" size="small" @click="handleStatusChange(scope.row)">启用</el-button>
                    <el-button v-hasPermission="['system:user:edit']" v-show="scope.row.status=='1'"  type="danger" size="small" @click="handleStatusChange(scope.row)">停用</el-button>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>
      </div>
    </div>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="!1">
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属机构" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" noOptionsText="暂无数据" :show-count="true" placeholder="请选择归属机构" @select="handelDeptIdChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属班组" prop="teamIds">
              <treeselect v-model="form.teamIds" :options="teamOptions" noOptionsText="该机构下没有班组信息" :normalizer="normalizer" :multiple="true" :show-count="true" placeholder="请选择归属班组" @select="handelparentIdChange"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户名称" maxlength="30"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户账号" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%;">
                <el-option
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_user_sex')"
                    v-bind="dict" :key="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="30" show-password/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.userId == undefined" label="确认密码" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" placeholder="请输入确认密码" type="password" maxlength="30" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
                <el-option
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                    :disabled="item.status == 0"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%;">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status == 0"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="!1">
      <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport"/>
            是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="已授权角色" :visible.sync="authRole.open" width="75vw" append-to-body :close-on-click-modal="!1" destroy-on-close>
      <div class="one-screen" style="height: 50vh;">
        <h4 class="main-title one-screen-fg0">基本信息</h4>
        <el-form class="one-screen-fg0" ref="form" :model="authRole.form" label-width="80px">
          <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item label="用户名称" prop="nickName">
                <el-input v-model="authRole.form.nickName" disabled maxlength="30"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="登录账号" prop="userName">
                <el-input v-model="authRole.form.userName" disabled maxlength="30"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <h4 class="main-title one-screen-fg0">角色信息</h4>
        <el-table v-loading="authRole.loading" class="one-screen-fg1" height="100%" :row-key="getRowKey" border @row-click="clickRow" ref="authRoleTable" @selection-change="handleAuthRoleSelectionChange" :data="authRole.roles">
          <el-table-column label="序号" type="index" align="center"></el-table-column>
          <!-- <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column> -->
          <!-- <el-table-column label="角色编号" align="center" prop="roleId"/> -->
          <el-table-column label="是否有效" align="center" prop="flag">
            <template slot-scope="scope">
              <span>{{ scope.row.flag?'有效':'无效' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色名称" align="center" prop="roleName"/>
          <el-table-column label="权限字符" align="center" prop="roleKey"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuthRoleForm">确 定</el-button>
        <el-button @click="authRole.open=!1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import apiPrefix from "@/api/apiPrefix.js";

export default {
  name: "UserIndex",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: {Treeselect},
  data() {
    const complexPW = (rule, value, callback) => {
      if (this.$$validator.isPwd(value)) {
        callback();
      } else {
        callback(new Error("密码为8到16位数字、小写字母、大写字母、特殊符号4类中的3类组合"));
      }
    };
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 用户名
      nickNameList: [],
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
      // 默认密码
      initPassword: '',
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 班组列表
      teamOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      //树形组件是否展开
      isExpend: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {},
        // 上传的地址
        url: `${apiPrefix('system')}/user/importData`,
        // url2: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      authRole: {
        open: false,
        // 遮罩层
        loading: true,
        // 分页信息
        total: 0,
        pageNum: 1,
        pageSize: 15,
        // 选中角色编号
        roleIds: [],
        // 角色信息
        roles: [],
        // 用户信息
        form: {}
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        {key: 0, label: `用户编号`, visible: true},
        {key: 1, label: `用户名称`, visible: true},
        {key: 2, label: `用户名称`, visible: true},
        {key: 3, label: `机构`, visible: true},
        {key: 4, label: `手机号码`, visible: true},
        {key: 5, label: `状态`, visible: true},
        {key: 6, label: `创建时间`, visible: true},
        {key: 7, label: `班组`, visible: true}
      ],
      // 表单校验
      rules: {
        deptId: [
          {required: true, message: "归属机构不能为空", trigger: "change"},
        ],
        userName: [
          {required: true, message: "请输入用户账号不能为空", trigger: "blur"},
          {min: 2, max: 20, message: '请输入用户账号长度必须介于 2 和 20 之间', trigger: 'blur'}
        ],
        nickName: [
          {required: true, message: "用户名称不能为空", trigger: "blur"}
        ],
        password: [
          {required: true, message: "用户密码不能为空", trigger: "blur"},
          {validator: complexPW, trigger: "blur"},
        ],
        confirmPassword: [
          {required: true, trigger: 'blur', message: '请再次输入新密码！'},
          {validator: complexPW, trigger: "blur"},
        ],
        email: [
          {
            // required: true,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            // required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选机构树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.upload.headers = {Authorization: "Bearer " + this.$$store.getters['user/GET_TOKEN']}
    // this.getConfigKey("sys.user.initPassword").then(response => {
    //   this.initPassword = response.msg;
    // });
  },
  methods: {
    // 树权限（展开/折叠）
    handleCheckedTreeExpand() {
      this.isExpend = !this.isExpend;
      this.$$treeExpandOrCollapse(this.$refs.tree, this.isExpend);
    },
    handleBatchClick(type) {
      if (type == 'end') {
        this.$$Dialog.confirm(`确认要"停用""${this.nickNameList.join(',')}"用户吗？`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.handleStatus('0')
        })
      }
      if (type == 'begin') {
        this.$$Dialog.confirm(`确认要"启用""${this.nickNameList.join(',')}"用户吗？`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.handleStatus('1')
        })
      }
      if (type == 'delete') {
        this.handleDelete()
      }

    },
    handleStatus(type) {
      let showText = type == '1' ? '启用成功' : '停用成功'
      let data = {
        "ids": this.ids,
        status: type
      }
      this.$$api.user
          .updataStatus({data: data})
          .then(({err}) => {
            if (err) return this.loading = false;
            this.getList();
            this.$$Toast.success(showText);
          });
    },
    // 确认密码校验
    confirmPwdValidate(rul, value, callback) {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致！'))
      } else if (value == this.form.password) {
        callback()
      }
    },
    // 机构变动时清除选择的班组，班组名，角色，获取班组数据
    handelDeptIdChange(val) {
      this.form.parentId = undefined
      this.form.teamIds = []
      this.form.roleIds = []
      this.roleOptions = []
      this.getTeamTreeInfo(val.id)
      this.getDeptRoleInfo(val.id)
    },
    getTeamTreeInfo(deptId) {
      this.$$api.team.getDeptTeamTree({deptId: deptId}).then(({res: response, err}) => {
        if (err) return
        this.teamOptions = this.$$handleTree(response.rows, "teamId");
      });
    },
    getDeptRoleInfo(deptId) {
      this.$$api.team.getDeptRoleTree({deptId: deptId}).then(({res: response, err}) => {
        if (err) return
        // 只有数据为空时，才进行赋值
        if (this.roleOptions.length == 0) {
          this.roleOptions = response.rows
        }
      });
    },
    // 班组变动时，角色也动态获取
    handelparentIdChange() {
      this.roleOptions = []
      this.form.roleIds = []
      setTimeout(() => {
        this.getTeamRoleInfo(this.form.teamIds.join(','))
      }, 0);

    },
    getTeamRoleInfo(teamId) {
      this.$$api.team.getTeamRoleTree({orgId: teamId}).then(({res: response, err}) => {
        if (err) return
        // 只有数据为空时，才进行赋值
        if (this.roleOptions.length == 0) {
          this.roleOptions = response.rows
        }
      });
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
    /** 查询用户列表 */
    getList() {
      // this.userList = Array.from({length: 20}).map((r, i) => ({userId: i}));
      // return this.total = 100;
      this.loading = true;
      this.$$api.user.listUser({loading: !1, params: this.$$addDateRange(this.queryParams, this.dateRange)})
          .then(({res: response, err}) => {
                if (err) return;
                this.userList = response.rows;
                this.total = response.total;
                this.loading = false;
              }
          );
    },
    /** 查询机构下拉树结构 */
    getDeptTree() {
      this.$$api.user.deptTreeSelect().then(({res, err}) => {
        if (err) return;
        this.deptOptions = res?.list || [];
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
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "停用" : "启用";
      let changeStatus=row.status === "0" ? "1" : "0";
      this.$$Dialog.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(() => {
        return this.$$api.user.changeUserStatus({data: {userId: row.userId, status:changeStatus}});
      }).then(({res, err}) => {
        if (err) return;
        row.status = row.status === "0" ? "1" : "0";
        this.$$Toast.success(text + "成功");
      })
      // .catch(function () {
      //   row.status = row.status === "0" ? "1" : "0";
      // });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        confirmPassword: undefined,
        status: "1",
        remark: undefined,
        // postIds: [],
        roleIds: [],
        teamIds: [],
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
      this.dateRange = [];
      this.$refs['queryForm']?.resetFields();
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.nickNameList = selection.map(item => item.nickName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
      this.form.password = this.initPassword;
      // this.$$api.user.getUser().then(({res: response, err}) => {
      //   if (err) return;
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加用户";
      //   this.form.password = this.initPassword;
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      this.$$api.user.getUser({userId}).then(({res: response, err}) => {
        if (err) return;
        this.form = response;
        this.roleOptions = response.roles;
        if(response.teams){
          this.teamOptions = this.$$handleTree(response.teams, "teamId");
        }else{
          this.teamOptions = [];
        }
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$$Dialog.prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (!this.$$validator.isPwd(value)) {
            return "密码为8到16位数字、小写字母、大写字母、特殊符号4类中的3类组合"
          }
        },
      }).then(({value}) => {
        this.$$api.user.resetUserPwd({data: {userId: row.userId, password: this.$$encrypt(value)}}).then(({res, err}) => {
          if (err) return;
          this.$$Toast.success("修改成功，新密码是：" + value);
        });
      }).catch(() => {
      });
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      if (row.userId) {
        this.authRole.loading = true;
        this.$$api.user.getAuthRole({userId: row.userId}).then(({res: response, err}) => {
          if (err) return this.authRole.loading = false;
          this.authRole.form = response.user;
          this.authRole.roles = response.roles;
          // this.total = this.roles.length;
          this.authRole.open = !0;
          this.$nextTick(() => {
            this.authRole.roles.forEach((v) => {
              if (v.flag) {
                this.$refs.authRoleTable.toggleRowSelection(v);
              }
            });
          });
          this.authRole.loading = false;
        });
      }
      this.$nextTick(() => this.$refs.authRoleTable?.doLayout());
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            this.$$api.user.updateUser({data: this.form}).then(({res, err}) => {
              if (err) return;
              this.$$Toast.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$$api.user.addUser({data: this.form}).then(({res, err}) => {
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
      const userIds = row?.userId || this.ids;
      let showText = ''
      if (this.ids.length > 0 && !row?.userId) {
        showText = this.nickNameList.join(',')
      } else {
        showText = row.nickName
      }
      this.$$Dialog.confirm('是否确认删除用户名称为"' + showText + '"的数据项？').then(() => {
        return this.$$api.user.delUser({userId: userIds});
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    async handleExport() {
      const {res, err} = await this.$$api.user.export({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `user_${new Date().getTime()}.xlsx`);
      // this.download('system/user/export', {
      //   ...this.queryParams
      // }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */ async importTemplate() {
      // this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`)
      const {res, err} = await this.$$api.user.importTemplate({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `user_template_${new Date().getTime()}.xlsx`);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //authrole
    /** 单击选中行数据 */
    clickRow(row) {
      this.$refs.authRoleTable.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleAuthRoleSelectionChange(selection) {
      this.authRole.roleIds = selection.map((item) => item.roleId);
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.roleId;
    },
    /** 提交按钮 */
    submitAuthRoleForm() {
      const userId = this.authRole.form.userId;
      const roleIds = this.authRole.roleIds.join(",");
      this.$$api.user.updateAuthRole({params: {userId: userId, roleIds: roleIds}}).then(({res, err}) => {
        if (err) return;
        this.$$Toast.success("授权成功");
        this.authRole.open = !1;
      });
    },
  }
};
</script>
<style scoped lang="scss">
.queryItem {
  width: 240px;
}

.dropdownBtn {
  margin-left: 6px
}
</style>
