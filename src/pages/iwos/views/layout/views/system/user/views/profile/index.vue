<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="main-title noMb">个人信息</div>
          <div>
            <div class="text-center" style="margin-bottom: 0.16rem;">
              <!--              <userAvatar/>-->
              <span class="avatar" :title="user.userName">{{ user.userName }}</span>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                用户名称
                <div class="pull-right">{{ user.nickName || '-' }}</div>
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
                所属机构
                <!-- / {{ postGroup || '-' }} -->
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName || '-' }} </div>
              </li>
              <li class="list-group-item rowShowData">
                <div>
                  部门班组
                </div>
                <div v-if="teamGroup.length>0">
                  <div v-for="item in teamGroup" :key="item"  class="rowElement">{{item}}</div>
                </div>
                <div v-else>-</div>
              </li>
              <li class="list-group-item rowShowData">
                <div>
                  所属角色
                </div>
                <div v-if="roleGroup.length>0">
                  <div v-for="item in roleGroup" :key="item"  class="rowElement">{{item}}</div>
                </div>
                <div v-else>-</div>
                <!-- <div class="pull-right">{{ roleGroup || '-' }}</div> -->
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
              <userInfo :user="user" @update="getUser"/>
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
// import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";

export default {
  name: "UserProfile",
  components: {userInfo, resetPwd},
  data() {
    return {
      user: {},
      roleGroup: null,
      teamGroup: null,
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
        this.teamGroup = response.reqOuterData.teamGroup;
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

.avatar {
  display: inline-block;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba($main-color, 0.75);
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
  font-size: 16px;
}
.rowShowData{
  display: flex;
  justify-content: space-between;
  .rowElement{
    text-align: right;
    padding-bottom: 7px;
  }
}
</style>
