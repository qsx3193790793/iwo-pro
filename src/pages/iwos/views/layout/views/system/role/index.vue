<template>
  <div class="app-container one-screen">
    <el-form
        :model="queryParams"
        class="one-screen-fg0"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            class="queryItem"
            maxlength="30"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
            maxlength="30"
            class="queryItem"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            class="queryItem"
        >
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
      <el-row type="flex" justify="end">
        <el-col :span="6">
          <el-form-item>
            <el-button size="small" @click="resetQuery"
            >重置
            </el-button
            >
            <el-button
                type="primary"
                v-hasPermission="['system:role:query']"
                size="small"
                @click="handleQuery"
            >查询
            </el-button
            >
            <el-button
                type="success"
                size="small"
                @click="handleAdd"
                v-hasPermission="['system:role:add']"
            >新增
            </el-button
            >
            <!-- <el-button
                type="danger"
                plain
                size="small"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermission="['system:role:remove']"
            >删除
            </el-button
            > -->
            <el-button
                type="warning"
                plain
                size="small"
                @click="handleExport"
                v-hasPermission="['system:role:export']"
            >导出
            </el-button>
            <el-dropdown trigger="click" @command="(command) => handleBatchClick(command)" v-hasPermission="['system:role:edit']" :disabled="multiple">
              <el-button type="danger" size="small" class="dropdownBtn" :disabled="multiple">
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="begin" v-hasPermission="['system:role:edit']">批量启用</el-dropdown-item>
                <el-dropdown-item command="end" v-hasPermission="['system:role:edit']">批量停用</el-dropdown-item>
                <el-dropdown-item command="delete" v-hasPermission="['system:role:remove']">批量删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <!-- <el-row :gutter="10" class="mb8 one-screen-fg0">
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="small"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermission="['system:role:edit']"
        >修改
        </el-button
        >
      </el-col>
    </el-row> -->
    <el-table
        v-loading="loading"
        class="one-screen-fg1"
        height="100%"
        ref="table"
        :data="roleList"
        border
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!-- <el-table-column label="角色编号" prop="roleId" width="180"/> -->
      <el-table-column
          label="角色名称"
          prop="roleName"
          :show-overflow-tooltip="true"

      />
      <el-table-column
          label="权限字符"
          prop="roleKey"
          :show-overflow-tooltip="true"

      />
      <!-- <el-table-column label="显示顺序" prop="roleSort" /> -->
      <el-table-column label="状态" align="center">
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
      <el-table-column label="创建人" prop="createBy"/>
      <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"

      >
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          width="240"
          class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
              size="small"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermission="['system:role:edit']"
          >修改
          </el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermission="['system:role:remove']"
          >删除
          </el-button
          >

          <el-dropdown v-hasPermission="['system:role:edit']" class="public-el-dropdown" trigger="click">
            <el-button type="primary">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="table-dropdown-menu">
              <div class="inner">
                <el-button v-hasPermission="['system:role:edit']" type="primary" size="small" @click="handleAuthUser(scope.row)">已授权用户</el-button>
                <el-button v-hasPermission="['system:role:edit']" v-show="scope.row.status=='0'" type="primary" size="small" @click="handleStatusChange(scope.row)">启用</el-button>
                <el-button v-hasPermission="['system:role:edit']" v-show="scope.row.status=='1'" type="danger" size="small" @click="handleStatusChange(scope.row)">停用</el-button>

              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <!--          <el-dropdown-->
          <!--              size="small"-->
          <!--              @command="(command) => handleCommand(command, scope.row)"-->
          <!--              v-hasPermission="['system:role:edit']"-->
          <!--              style="margin-left: 6px;"-->
          <!--          >-->
          <!--            <el-button type="primary">-->
          <!--              更多<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--            </el-button>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              &lt;!&ndash; <el-dropdown-item-->
          <!--                  command="handleDataScope"-->
          <!--                  icon="el-icon-circle-check"-->
          <!--                  v-hasPermission="['system:role:edit']"-->
          <!--              >数据权限-->
          <!--              </el-dropdown-item-->
          <!--              > &ndash;&gt;-->
          <!--              <el-dropdown-item-->
          <!--                  command="handleAuthUser"-->
          <!--                  icon="el-icon-user"-->
          <!--                  v-hasPermission="['system:role:edit']"-->
          <!--              >分配用户-->
          <!--              </el-dropdown-item-->
          <!--              >-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>

    <!-- 添加或修改角色配置对话框 -->
    <MDialog v-model="open" :title="title" width="7rem" height="65vh" @handelClose="reset">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" maxlength="30"/>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="roleKey">
              <span slot="label">
                <el-tooltip
                    content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                    placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
              <el-input v-model="form.roleKey" placeholder="请输入权限字符" maxlength="30"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="9">
            <el-form-item label="角色顺序" prop="roleSort">
              <el-input-number
                  v-model="form.roleSort"
                  controls-position="right"
                  :min="0"
              />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item label="备注">
          <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
          ></el-input>
        </el-form-item>


        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单权限" class="custom-form-item">
              <el-checkbox
                  v-model="menuNodeAll"
                  @change="handleCheckedTreeNodeAll($event, 'menu')"
              >全选/全不选
              </el-checkbox
              >
              <el-checkbox
                  v-model="form.menuCheckStrictly"
                  @change="handleCheckedTreeConnect($event, 'menu')"
              >父子联动
              </el-checkbox
              >
              <div>
                <el-input
                    v-model="tree_menu"
                    placeholder="请输入菜单权限"
                    clearable
                    size="small"
                    maxlength="30"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 5px"
                >
                  <template slot="append">
                    <el-button type="primary" @click="tree_menu_isExpend=!tree_menu_isExpend;handleCheckedTreeExpand(tree_menu_isExpend,'menu')">{{ tree_menu_isExpend ? '折叠' : '展开' }}</el-button>
                  </template>
                </el-input>
              </div>
              <div>
                <el-tree
                    class="tree-content tree-border"
                    :data="menuOptions"
                    :filter-node-method="filterMenuNode"
                    show-checkbox
                    ref="menu"
                    node-key="id"
                    :check-strictly="!form.menuCheckStrictly"
                    empty-text="加载中，请稍候"
                    :props="defaultProps"
                ></el-tree>
              </div>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉来源" class="custom-form-item">
              <el-checkbox
                  v-model="complaintSourceNodeAll"
                  @change="handleCheckedTreeNodeAll($event, 'complaintSource')"
              >全选/全不选
              </el-checkbox
              >
              <el-checkbox
                  disabled
                  v-model="form.complaintSourceCheckStrictly"
                  @change="handleCheckedTreeConnect($event, 'complaintSource')"
              >父子联动
              </el-checkbox
              >
              <div>
                <el-input
                    v-model="tree_channel"
                    placeholder="请输入投诉来源名称"
                    clearable
                    size="small"
                    maxlength="30"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 5px"
                >
                  <template slot="append">
                    <el-button type="primary" @click="tree_channel_isExpend=!tree_channel_isExpend;handleCheckedTreeExpand(tree_channel_isExpend,'complaintSource')">{{ tree_channel_isExpend ? '折叠' : '展开' }}</el-button>
                  </template>
                </el-input>
              </div>
              <el-tree
                  class="tree-content tree-border"
                  :data="complaintSourceOptions"
                  :filter-node-method="filterChannelNode"
                  show-checkbox
                  ref="complaintSource"
                  node-key="sourceCode"
                  :check-strictly="!form.complaintSourceCheckStrictly"
                  empty-text="加载中，请稍候"
                  :props="defaultComplaintSourceProps"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </MDialog>

    <!-- 分配角色数据权限对话框 -->
    <MDialog v-model="openDataScope" :title="title" width="7rem">
      <el-form :model="form" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" maxlength="30"/>
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" maxlength="30"/>
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox
              v-model="deptExpand"
              @change="handleCheckedTreeExpand($event, 'dept')"
          >展开/折叠
          </el-checkbox
          >
          <el-checkbox
              v-model="deptNodeAll"
              @change="handleCheckedTreeNodeAll($event, 'dept')"
          >全选/全不选
          </el-checkbox
          >
          <el-checkbox
              v-model="form.deptCheckStrictly"
              @change="handleCheckedTreeConnect($event, 'dept')"
          >父子联动
          </el-checkbox
          >
          <el-tree
              class="tree-border tree-content"
              :data="deptOptions"
              show-checkbox
              default-expand-all
              ref="dept"
              node-key="id"
              :check-strictly="!form.deptCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </MDialog>

    <!-- 分配用户 -->
    <MDialog v-model="authUser.open" title="已授权用户" width="75vw">
      <div class="one-screen" style="height: 50vh;">
        <el-form class="one-screen-fg0" :model="authUser.queryParams" ref="queryAuthUserForm" size="small" :inline="true">
          <el-form-item label="用户账号" prop="userName">
            <el-input
                v-model="authUser.queryParams.userName"
                placeholder="请输入用户账号"
                clearable
                style="width: 240px"
                maxlength="30"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
                v-model="authUser.queryParams.phonenumber"
                placeholder="请输入手机号码"
                clearable
                style="width: 240px"
                maxlength="30"
                @keyup.enter.native="handleAuthUserQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="resetAuthUserQuery">重置</el-button>
            <el-button type="primary" size="small" @click="handleAuthUserQuery">查询</el-button>
            <!-- <el-button type="success" size="small" @click="openSelectUser" v-hasPermission="['system:role:add']">添加用户</el-button> -->
            <el-button type="danger" size="small" :disabled="authUser.multiple" @click="cancelAuthUserAll" v-hasPermission="['system:role:remove']">批量取消授权</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="authUser.loading" class="one-screen-fg1" height="100%" ref="authUserTable" :data="authUser.userList" border @selection-change="handleAuthUserSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="用户账号" prop="userName" :show-overflow-tooltip="true"/>
          <el-table-column label="用户名称" prop="nickName" :show-overflow-tooltip="true"/>
          <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true"/>
          <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="{row}">
              <!--          <dict-tag :options="$$dictionaries.get('sys_normal_disable')" :value="scope.row.status"/>-->
              {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable', row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="cancelAuthUser(scope.row)" v-hasPermission="['system:role:remove']">取消授权</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="one-screen-fg0" :current-page.sync="authUser.queryParams.pageNum" :page-size.sync="authUser.queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="authUser.total" @size-change="getAuthUserList" @current-change="getAuthUserList"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authUser.open=!1">取 消</el-button>
      </div>
    </MDialog>

    <select-user ref="selectUser" :roleId="authUser.queryParams.roleId" @ok="handleQuery"/>

  </div>
</template>

<script>
import selectUser from "./selectUser";
import MDialog from '@/components/MDialog';

export default {
  name: "RoleIndex",
  dicts: ["sys_normal_disable"],
  components: {selectUser, MDialog},
  data() {
    return {
      authUser: {
        open: false,
        // 遮罩层
        loading: false,
        // 选中用户组
        userIds: [],
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 用户表格数据
        userList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 15,
          roleId: undefined,
          userName: undefined,
          phonenumber: undefined
        }
      },
      // 树的数据筛选
      tree_menu: '',
      tree_channel: '',
      tree_menu_isExpend: false,
      tree_channel_isExpend: false,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 选中角色的名称
      roleNameList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      complaintSourceExpand: false,
      menuNodeAll: false,
      complaintSourceNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限",
        },
        {
          value: "2",
          label: "自定数据权限",
        },
        {
          value: "3",
          label: "本机构数据权限",
        },
        {
          value: "4",
          label: "本机构及以下数据权限",
        },
        {
          value: "5",
          label: "仅本人数据权限",
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 投诉来源
      complaintSourceOptions: [],
      // 机构列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
      },
      list: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultComplaintSourceProps: {
        children: "children",
        label: "sourceName",
      },
      // 表单校验
      rules: {
        roleName: [
          {required: true, message: "角色名称不能为空", trigger: "blur"},
        ],
        roleKey: [
          {required: true, message: "权限字符不能为空", trigger: "blur"},
        ],
        // roleSort: [
        //   {required: true, message: "角色顺序不能为空", trigger: "blur"},
        // ],
      },
    };
  },
  created() {
    this.getList();
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  watch: {
    // 根据名称筛选菜单树
    tree_menu(val) {
      this.$refs.menu.filter(val);
    },
    // 根据名称筛选投诉来源树
    tree_channel(val) {
      console.log("---998", val)
      this.$refs.complaintSource.filter(val);
    },

  },
  methods: {
    // 筛选节点
    filterMenuNode(value, data) {
      if (!value) {
        this.tree_menu_isExpend = true;
        this.$$treeExpandOrCollapse(this.$refs.menu, this.tree_menu_isExpend);
        return true;
      }
      this.tree_menu_isExpend = true;
      return data.label.indexOf(value) !== -1;
    },
    // 筛选节点
    filterChannelNode(value, data) {
      if (!value) {
        this.tree_channel_isExpend = true;
        this.$$treeExpandOrCollapse(this.$refs.complaintSource, this.tree_channel_isExpend);
        return true;
      }
      this.tree_channel_isExpend = true;
      return data.sourceName.indexOf(value) !== -1;
    },
    handleBatchClick(type) {
      // 确认要"停用""上海管理员"角色吗？
      if (type == 'end') {
        this.$$Dialog.confirm(`确认要"停用""${this.roleNameList.join(',')}"角色吗？`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.handleStatus('0')
        })
      }
      if (type == 'begin') {
        this.$$Dialog.confirm(`确认要"启用""${this.roleNameList.join(',')}"角色吗？`, '提示', {
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
      this.$$api.role
          .updataStatus({data: data})
          .then(({err}) => {
            if (err) return this.loading = false;
            this.getList();
            this.$$Toast.success(showText);
          });
    },
    /** 查询角色列表 */
    getList() {
      // this.roleList = Array.from({length: 20}).map((r, i) => ({roleId: i}));
      // return this.total = 100;
      this.loading = true;
      this.$$api.role
          .listRole({params: this.$$addDateRange(this.queryParams, this.dateRange)})
          .then(({res: response, err, total}) => {
            if (err) return this.loading = false;
            this.roleList = response.rows || [];
            this.total = response.total;
            this.loading = false;
          });
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      this.$$api.menu.menuTreeselect().then(({res: response, err}) => {
        if (err) return;
        this.menuOptions = response.list;
      });
    },
    /** 查询投诉来源下拉树结构 */
    async getcomplaintSourceTree() {
      await this.$$api.complaintSource
          .listComplaintSourceTree({data: {status: 1}})
          .then(({res: response, err}) => {
            if (err) return;
            this.complaintSourceOptions = response?.list || [];
          });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有机构节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的机构节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的机构节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有投诉来源数据
    getComplaintSourceAllCheckedKeys() {
      // 目前被选中的机构节点
      let checkedKeys = this.$refs.complaintSource.getCheckedKeys();
      // 半选中的机构节点
      let halfCheckedKeys = this.$refs.complaintSource.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return this.$$api.menu.roleMenuTreeselect({roleId}).then(({res: response, err}) => {
        if (err) return [];
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询机构树结构 */
    getDeptTree(roleId) {
      return this.$$api.role.deptTreeSelect({roleId}).then(({res: response, err}) => {
        if (err) return [];
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "停用" : "启用";
      let changeStatus = row.status === "0" ? "1" : "0";
      this.$$Dialog
          .confirm('确认要"' + text + '""' + row.roleName + '"角色吗？')
          .then(() => {
            return this.$$api.role.changeRoleStatus({data: {roleId: row.roleId, status: changeStatus}});
          })
          .then(({res, err}) => {
            if (err) return
            // row.status = row.status === "0" ? "1" : "0";
            this.getList();
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
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      (this.menuExpand = false),
          (this.menuNodeAll = false),
          (this.complaintSourceExpand = false),
          (this.tree_menu_isExpend = false),
          (this.tree_channel_isExpend = false),
          (this.complaintSourceNodeAll = false),
          (this.deptExpand = true),
          (this.deptNodeAll = false),
          (this.menuOptions = []),
          (this.complaintSourceOptions = []),
          (this.form = {
            roleId: undefined,
            roleName: undefined,
            roleKey: undefined,
            // roleSort: 0,
            status: "0",
            menuIds: [],
            deptIds: [],
            menuCheckStrictly: true,
            complaintSourceCheckStrictly: true,
            deptCheckStrictly: true,
            remark: undefined,
          });
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId);
      this.roleNameList = selection.map((item) => item.roleName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    // handleCommand(command, row) {
    //   switch (command) {
    //     case "handleDataScope":
    //       this.handleDataScope(row);
    //       break;
    //     case "handleAuthUser":
    //       this.handleAuthUser(row);
    //       break;
    //     default:
    //       break;
    //   }
    // },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      // 新树数据
      // if (type == "menu") {
      //   let treeList = this.menuOptions;
      //   for (let i = 0; i < treeList.length; i++) {
      //     this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      //   }
      // } else if (type == "dept") {
      //   let treeList = this.deptOptions;
      //   for (let i = 0; i < treeList.length; i++) {
      //     this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
      //   }
      // } else if (type == "complaintSource") {
      //   let treeList = this.complaintSourceOptions;
      //   for (let i = 0; i < treeList.length; i++) {
      //     this.$refs.complaintSource.store.nodesMap[treeList[i].sourceCode].expanded = value;
      //   }
      // }
      // ruoyi数据根据不同的type处理展开
      console.log(value, '----998')
      Object.values(this.$refs[type].store.nodesMap).forEach(item => item.expanded = value)
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      } else if (type == "complaintSource") {
        this.$refs.complaintSource.setCheckedNodes(value ? this.complaintSourceOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.form.menuCheckStrictly = value ? true : false;
      } else if (type == "dept") {
        this.form.deptCheckStrictly = value ? true : false;
      } else if (type == "complaintSource") {
        this.form.complaintSourceCheckStrictly = value ? true : false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.getcomplaintSourceTree()
      this.open = true;
      this.title = "添加角色";

    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      await this.getcomplaintSourceTree()
      const roleId = row.roleId || this.ids;
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      const srlRoleList = this.getsrlRoleListTree(roleId);
      this.$$api.role.getRole({roleId}).then(({res: response, err}) => {
        if (err) return;
        this.form = response;
        this.form.complaintSourceCheckStrictly = true;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then((res) => {
            let checkedKeys = res.checkedKeys;
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              });
            });
          });
          srlRoleList.then((res) => {
            let checkedKeys = res
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.complaintSource.setChecked(v, true, false);
              });
            });
          });

        });
        this.title = "修改角色";
      });
    },
    getsrlRoleListTree(roleId) {
      return this.$$api.role.getAskSourceSrlRoleList({roleId}).then(({res: response, err}) => {
        if (err) return [];
        return response.list;
      });
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== "2") {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const deptTreeSelect = this.getDeptTree(row.roleId);
      this.$$api.role.getRole({roleId: row.roleId}).then(({res: response, err}) => {
        if (err) return;
        this.form = response;
        this.openDataScope = true;
        this.$nextTick(() => {
          deptTreeSelect.then((res) => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "分配数据权限";
      });
    },
    /** 分配用户操作 */
    handleAuthUser: function (row) {
      if (row.roleId) {
        this.authUser.queryParams.roleId = row.roleId;
        this.getAuthUserList();
      }
      this.$nextTick(() => this.$refs.authUserTable?.doLayout());
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            this.form.askSourceIds = this.getComplaintSourceAllCheckedKeys();
            this.$$api.role.updateRole({data: this.form}).then(({res, err}) => {
              if (err) return;
              this.$$Toast.success("修改成功");
              this.open = false;
              this.getList();
              // 树的展开信息重置
              this.reset()
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            this.form.askSourceIds = this.getComplaintSourceAllCheckedKeys();
            this.$$api.role.addRole({data: this.form}).then(({res, err}) => {
              if (err) return;
              this.$$Toast.success("新增成功");
              this.open = false;
              this.getList();
              // 树的展开信息重置
              this.reset()
            });
          }
        } else {
          this.$$Toast.warning("有必填项未填写");
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function () {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        this.$$api.role.dataScope({data: this.form}).then(({res, err}) => {
          if (err) return;
          this.$$Toast.success("修改成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row?.roleId || this.ids
      let showText = ''
      if (this.ids.length > 0 && !row?.roleId) {
        showText = this.roleNameList.join(',')
      } else {
        this.roleNameList = []
        showText = row.roleName
      }
      if (roleIds?.length) {
        this.$$Dialog
            .confirm('是否确认删除角色名称为"' + showText + '"的数据项？')
            .then(() => {
              return this.$$api.role.delRole({roleId: roleIds});
            })
            .then(({res, err}) => {
              if (err) return;
              this.getList();
              this.$$Toast.success("删除成功");
            })
            .catch(() => {
            });
      }
    },
    /** 导出按钮操作 */
    async handleExport() {
      const {res, err} = await this.$$api.role.export({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `角色管理_${new Date().getTime()}.xlsx`);
      // this.download(
      //   "system/role/export",
      //   {
      //     ...this.queryParams,
      //   },
      //   `role_${new Date().getTime()}.xlsx`
      // );
    },

    //authUser
    getAuthUserList() {
      // this.userList = Array.from({length: 20}).map((r, i) => ({userId: i}));
      // return this.total = 100;
      this.authUser.loading = true;
      this.$$api.role.allocatedUserList({params: this.authUser.queryParams}).then(({res: response, err, total}) => {
            if (err) return this.authUser.loading = false;
            this.authUser.userList = response.rows || [];
            this.authUser.total = response.total;
            this.authUser.loading = false;
            this.authUser.open = true;
          }
      );
    },
    /** 搜索按钮操作 */
    handleAuthUserQuery() {
      this.authUser.queryParams.pageNum = 1;
      this.getAuthUserList();
    },
    /** 重置按钮操作 */
    resetAuthUserQuery() {
      this.$refs['queryAuthUserForm']?.resetFields();
      this.handleAuthUserQuery();
    },
    // 多选框选中数据
    handleAuthUserSelectionChange(selection) {
      this.authUser.userIds = selection.map(item => item.userId)
      this.authUser.multiple = !selection.length
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.selectUser.show();
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      const roleId = this.authUser.queryParams.roleId;
      this.$$Dialog.confirm('确认要取消该用户"' + row.userName + '"角色吗？').then(() => {
        return this.$$api.role.authUserCancel({data: {userId: row.userId, roleId: roleId}});
      }).then(({res, err}) => {
        if (err) return;
        this.getAuthUserList();
        this.$$Toast.success("取消授权成功");
      }).catch(() => {
      });
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll(row) {
      const roleId = this.authUser.queryParams.roleId;
      const userIds = this.authUser.userIds.join(",");
      this.$$Dialog.confirm('是否取消选中用户授权数据项？').then(() => {
        return this.$$api.role.authUserCancelAll({params: {roleId: roleId, userIds: userIds}});
      }).then(({res, err}) => {
        if (err) return;
        this.getAuthUserList();
        this.$$Toast.success("取消授权成功");
      }).catch(() => {
      });
    }
  },
};
</script>
<style scoped lang="scss">
.queryItem {
  width: 240px;
}

.dropdownBtn {
  margin-left: 6px
}

.custom-form-item {
  display: flex;
  flex-direction: column;

  ::v-deep .el-form-item__content {
    margin-left: 60px !important
  }
}

.tree-content {
  max-height: 300px;
  min-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
</style>
