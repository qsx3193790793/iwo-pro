<template>
  <div class="app-container one-screen">
    <h4 class="main-title one-screen-fg0">基本信息</h4>
    <el-form class="one-screen-fg0" ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="form.userName" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="main-title one-screen-fg0">角色信息</h4>
    <el-table v-loading="loading" class="one-screen-fg1" height="100%" :row-key="getRowKey" border @row-click="clickRow" ref="table" @selection-change="handleSelectionChange" :data="roles">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="角色编号" align="center" prop="roleId"/>
      <el-table-column label="角色名称" align="center" prop="roleName"/>
      <el-table-column label="权限字符" align="center" prop="roleKey"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form class="one-screen-fg0" label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UserAuthRole",
  data() {
    return {
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
    };
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId;
    if (userId) {
      this.loading = true;
      this.$$api.user.getAuthRole({userId}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.form = response.user;
        this.roles = response.roles;
        // this.total = this.roles.length;
        this.$nextTick(() => {
          this.roles.forEach((row) => {
            if (row.flag) {
              this.$refs.table.toggleRowSelection(row);
            }
          });
        });
        this.loading = false;
      });
    }
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    /** 单击选中行数据 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.roleId);
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.roleId;
    },
    /** 提交按钮 */
    submitForm() {
      const userId = this.form.userId;
      const roleIds = this.roleIds.join(",");
      this.$$api.user.updateAuthRole({params: {userId: userId, roleIds: roleIds}}).then(({res, err}) => {
        if (err) return;
        this.$$Toast.success("授权成功");
        // this.close();
      });
    },
    /** 关闭按钮 */
    close() {
      // const obj = {path: "/system/user"};
      // this.$tab.closeOpenPage(obj);
      this.$router.replace({name: 'UserIndex'});
    },
  },
};
</script>
