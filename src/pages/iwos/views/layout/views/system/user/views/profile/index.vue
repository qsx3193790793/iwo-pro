<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="main-title noMb">个人信息</div>
          <div>
            <div class="text-center" style="margin-bottom: 0.16rem;">
              <userAvatar/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                用户名称
                <div class="pull-right">{{ user.userName || '-' }}</div>
              </li>
              <li class="list-group-item">
                手机号码
                <div class="pull-right">{{ user.phonenumber || '-' }}</div>
              </li>
              <li class="list-group-item">
                用户邮箱
                <div class="pull-right">{{ user.email || '-' }}</div>
              </li>
              <li class="list-group-item">
                所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName || '-' }} / {{ postGroup || '-' }}</div>
              </li>
              <li class="list-group-item">
                所属角色
                <div class="pull-right">{{ roleGroup || '-' }}</div>
              </li>
              <li class="list-group-item">
                创建日期
                <div class="pull-right">{{ user.createTime || '-' }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="main-title noMb">个人信息</div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";

export default {
  name: "UserProfile",
  components: {userAvatar, userInfo, resetPwd},
  data() {
    return {
      user: {},
      roleGroup: null,
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.$$api.user.getUserProfile().then(({res: response, err}) => {
        if (err) return;
        this.user = response;
        this.roleGroup = response.reqOuterData.roleGroup;
        this.postGroup = response.reqOuterData.postGroup;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.text-center {
  text-align: center
}
</style>
