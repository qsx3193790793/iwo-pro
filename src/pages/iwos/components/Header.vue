<template>
  <div class="header">
    <div class="sys-name">
      <i class="iconfont icon-dianxin"></i>
      <i class="iconfont icon-a-10000logo1"></i>
      <!--      <img src="~@assets/images/10000.png" alt=""/>-->
      <span>智慧客服工单系统</span>
    </div>
    <div class="tools">
      <i class="iconfont icon-sousuo_search"></i>
      <i class="iconfont icon-tixing_remind"></i>
      <i class="iconfont icon-suo"></i>
      <el-popover popper-class="user-panel-popover" placement="bottom" trigger="click">
        <template #reference>
          <div class="avatar">
            <!--            <i class="el-icon-user"></i>-->
            <span>{{ $$store.getters['user/GET_USER_INFO']?.nickName || '用户名' }}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
        </template>
        <div class="user-panel">
          <div class="item" @click="$router.push({name:'UserProfile'})">个人中心</div>
          <div class="item" @click="logout">退出登录</div>
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script setup>
import {getCurrentInstance} from 'vue';

const {proxy} = getCurrentInstance();

function logout() {
  // 二次确认

  proxy.$$store.dispatch('user/DO_LOGOUT');
}

</script>
<style lang="scss" scoped>
::v-global(.user-panel-popover) {
  padding: 8px !important;
}

.user-panel {
  text-align: center;
  display: flex;
  flex-direction: column;

  .item {
    line-height: 2;
    margin: 0 0 4px 0;
    color: rgba(97, 101, 110, 1);
    cursor: pointer;

    &:hover {
      color: $main-color;
      background-color: rgba($main-color, 0.2);
    }
  }
}

.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  height: $header-height;
  background-color: rgba(237, 244, 254, 1);
  box-shadow: 0 2px 6px rgba(0, 21, 41, .1);

  .sys-name {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;

    .icon-dianxin {
      display: flex;
      justify-content: center;
      align-items: stretch;
      width: $main-nav-width;
      background-color: $main-color;
      color: #fff;
      font-size: 40px;
    }

    & > .icon-a-10000logo1 {
      color: $main-color;
      font-size: 24px;
      margin: 0 15px;
    }

    & > span {
      color: $main-color;
      font-size: 24px;
      letter-spacing: 2px;
    }
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: rgba(97, 101, 110, 1);
    cursor: pointer;

    & > span {
      margin: 0 8px;
    }

    & > .el-icon-user {
      font-size: 20px;
      padding: 6px;
      border-radius: 50%;
      //box-shadow: 0 1px 6px rgba(97, 101, 110, 1);;
      margin-left: 8px;
      color: rgba(97, 101, 110, 1);
    }
  }

  & > .tools {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(97, 101, 110, 1);
    font-size: 20px;
    margin-right: 30px;

    & > .iconfont {
      margin: 0 6px;
      cursor: pointer;
    }
  }

  & > .navigation {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-dropdown-link {
      color: #fff;
      font-size: 14px;
      line-height: 40px;
      padding: 0 20px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      &.active {
        background-color: #007bff;
      }

      & > .iconfont {
        margin-right: 2px;
      }
    }
  }


}
</style>
