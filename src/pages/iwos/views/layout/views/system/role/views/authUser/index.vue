<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-back" size="small" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8 one-screen-fg0">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="small"
            @click="openSelectUser"
            v-hasPermission="['system:role:add']"
        >添加用户
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-circle-close"
            size="small"
            :disabled="multiple"
            @click="cancelAuthUserAll"
            v-hasPermission="['system:role:remove']"
        >批量取消授权
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="warning"-->
      <!--            plain-->
      <!--            icon="el-icon-close"-->
      <!--            size="small"-->
      <!--            @click="handleClose"-->
      <!--        >关闭-->
      <!--        </el-button>-->
      <!--      </el-col>-->
    </el-row>

    <el-table v-loading="loading" class="one-screen-fg1" height="100%" ref="table" :data="userList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true"/>
      <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true"/>
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
          <el-button
              size="small"
              type="text"
              icon="el-icon-circle-close"
              @click="cancelAuthUser(scope.row)"
              v-hasPermission="['system:role:remove']"
          >取消授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>
    <select-user ref="select" :roleId="queryParams.roleId" @ok="handleQuery"/>
  </div>
</template>

<script>
import selectUser from "./selectUser";

export default {
  name: "RoleAuthUser",
  dicts: ['sys_normal_disable'],
  components: {selectUser},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中用户组
      userIds: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
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
    };
  },
  created() {
    const roleId = this.$route.params && this.$route.params.roleId;
    if (roleId) {
      this.queryParams.roleId = roleId;
      this.getList();
    }
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    },
    /** 查询授权用户列表 */
    getList() {
      // this.userList = Array.from({length: 20}).map((r, i) => ({userId: i}));
      // return this.total = 100;
      this.loading = true;
      this.$$api.role.allocatedUserList({params: this.queryParams}).then(({res: response, err, total}) => {
            if (err) return this.loading = false;
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
      );
    },
    // 返回按钮
    handleClose() {
      // const obj = {path: "/system/role"};
      // this.$tab.closeOpenPage(obj);
      this.$router.replace({name: 'RoleIndex'});
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
      this.userIds = selection.map(item => item.userId)
      this.multiple = !selection.length
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.show();
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      const roleId = this.queryParams.roleId;
      this.$$Dialog.confirm('确认要取消该用户"' + row.userName + '"角色吗？').then(() => {
        return this.$$api.role.authUserCancel({data: {userId: row.userId, roleId: roleId}});
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("取消授权成功");
      }).catch(() => {
      });
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll(row) {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      this.$$Dialog.confirm('是否取消选中用户授权数据项？').then(() => {
        return this.$$api.role.authUserCancelAll({params: {roleId: roleId, userIds: userIds}});
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("取消授权成功");
      }).catch(() => {
      });
    }
  }
};
</script>
