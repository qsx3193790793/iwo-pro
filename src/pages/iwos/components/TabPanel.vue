<template>
  <div class="tab-panel">
    <div class="left">
      <i v-if="$store.getters['storage/GET_NAV_SETTING_CAN_COLLAPSE']" class="iconfont" :class="$store.getters['storage/GET_NAV_SETTING_IS_COLLAPSE']?'icon-shouqicaidan':'icon-zhankaicaidan'" @click="handleCollapse"></i>
      <i class="iconfont icon-shouye"></i>
    </div>
    <el-tabs v-model="active" class="center" type="card" @tab-click="handlerClick" @tab-remove="$store.commit('storage/REMOVE_TAB', $event)">
      <el-tab-pane v-for="v in tabs" :label="v.name" :name="v.key" :key="v.key" :closable="v.closable" :data-c="v.closable"></el-tab-pane>
    </el-tabs>
    <div class="right">
      <i class="iconfont icon-shuaxin_refresh"></i>
    </div>
  </div>
</template>
<script setup>
import {computed, getCurrentInstance, watchEffect} from "vue";

// const router = {};
const {proxy} = getCurrentInstance();

const active = computed({
  get: () => proxy.$$store.getters['storage/GET_ACTIVE_TAB_KEY'],
  set: proxy.$$emptyFn
});

const tabs = computed(() => proxy.$store.getters['storage/GET_ACTIVE_TABS']);

function handlerClick(key) {
  const finder = tabs.value[key.index]
  proxy.$$router.push({name: finder.routeName, query: finder?.query, params: finder?.params});
}

function handleCollapse() {
  proxy.$store.commit('storage/SET_NAV_SETTING', {isCollapse: !proxy.$store.getters['storage/GET_NAV_SETTING_IS_COLLAPSE']})
}

</script>
<style lang="scss" scoped>

.tab-panel {
  position: relative;
  z-index: 1;
  height: $tab-height;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1PX solid rgba(172, 183, 202, 1);
  background-color: rgb(218, 231, 250);

  & > .left, & > .right {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
    white-space: nowrap;

    & > i {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0 12px;
      cursor: pointer;
    }
  }

  & > .left > i {
    border-right: 1PX solid rgba(172, 183, 202, 1);
  }

  & > .right > i {
    border-left: 1PX solid rgba(172, 183, 202, 1);
  }

  & > .center {
    flex-grow: 1;
    overflow: hidden;
  }

  ::v-deep(.el-tabs--card>.el-tabs__header .el-tabs__nav), ::v-deep(.el-tabs--card>.el-tabs__header) {
    border: none !important;
  }

  ::v-deep(.el-tabs__header.is-top) {
    margin: 0 !important;
  }

  ::v-deep(.el-tabs--card>.el-tabs__header) {
    height: 100%;
  }

  ::v-deep(.el-tabs__nav-prev), ::v-deep(.el-tabs__nav-next) {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 21px;
    top: 0;
    bottom: 0;
    line-height: 1;
  }

  ::v-deep(.el-tabs__nav-next) {
    border-left: 1PX solid rgb(172, 183, 202);
  }

  ::v-deep(.el-tabs__nav-prev) {
    border-right: 1PX solid rgb(172, 183, 202);
  }

  ::v-deep(.el-tabs__item) {
    font-size: 14px !important;
    background-color: transparent;
    color: $main-text;
    line-height: $tab-height;
    border-right: 1PX solid rgba(172, 183, 202, 1) !important;
    height: 100%;

    & > .el-icon-close {
      font-size: 16px;
    }

  }

  ::v-deep(.el-tabs__item.is-active) {
    background-color: #fff;
  }
}
</style>
