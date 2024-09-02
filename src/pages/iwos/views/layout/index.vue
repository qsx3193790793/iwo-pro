<template>
  <div class="app-main">
    <Header class="header"></Header>
    <div class="bottom">
      <Navigation></Navigation>
      <div class="right">
        <TabPanel class="tab-panel"></TabPanel>
        <div class="layout">
          <ELScrollbar>
            <keep-alive :include="alivePage">
              <router-view :key="$route.name"></router-view>
            </keep-alive>
            <!--            <router-view v-slot="{ Component }">-->
            <!--              <keep-alive :include="alivePage">-->
            <!--                <component :is="Component" :key="$route.name"/>-->
            <!--              </keep-alive>-->
            <!--            </router-view>-->
          </ELScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import TabPanel from '../../components/TabPanel';
import {watchEffect, computed, getCurrentInstance} from 'vue';

const {proxy} = getCurrentInstance();

const alivePage = computed(() => proxy.$$store.getters['keepAlive/GET_ALIVE_PAGE']);

watchEffect(() => {
  console.log('alivePage', alivePage.value, proxy.$route.name);
});
</script>

<style lang="scss" scoped>

.bottom {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: calc(100vh - #{$header-height}); //100vh-header

  & > .right {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    overflow: hidden;

    & > .tab-panel {
      flex-grow: 0;
      flex-shrink: 0;
    }

    & > .layout {
      flex-grow: 1;
      background: linear-gradient(135deg, #c7dbfc 0%, #e2eefe 100%);
      overflow: hidden;

      & > ::v-deep(.el-scrollbar) {
        height: calc(100% - 16px);
        margin: 12px;
        border-radius: 6px;
        overflow: hidden;

        & > .el-scrollbar__wrap > .el-scrollbar__view {
          height: 100%;

          //& > div {
          //  padding: 4px
          //}
        }
      }
    }
  }
}


</style>
