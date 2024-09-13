<template>
  <div class="app-main">
    <Header class="header"></Header>
    <div class="bottom">
      <Navigation></Navigation>
      <div class="right">
        <TabPanel class="tab-panel"></TabPanel>
        <div class="layout">
          <!--          <ELScrollbar>-->
          <keep-alive :include="alivePage">
            <router-view v-if="!$route.meta.isMultiTab" :data-mid="$route.query?.tabId" :multiId="$route.query?.tabId" :key="$route.name"></router-view>
            <template v-else>
              <template v-for="v in multiPages">
                <router-view v-if="v.tabId===$route.query.tabId" :data-mid="v.tabId" :multiId="v.tabId" :key="$route.name+v.tabId"></router-view>
              </template>
            </template>
          </keep-alive>
          <!--            <router-view v-slot="{ Component }">-->
          <!--              <keep-alive :include="alivePage">-->
          <!--                <component :is="Component" :key="$route.name"/>-->
          <!--              </keep-alive>-->
          <!--            </router-view>-->
          <!--          </ELScrollbar>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import TabPanel from '../../components/TabPanel';
import {ref, watchEffect, computed, getCurrentInstance, watch} from 'vue';

const {proxy} = getCurrentInstance();

const alivePage = computed(() => proxy.$$store.getters['keepAlive/GET_ALIVE_PAGE']);

const multiPages = computed(() => proxy.$$store.getters['storage/GET_MULTI_TABS'])

watch(() => proxy.$route.query?.tabId, () => {
  console.log('watch tabId', proxy.$route.query?.tabId);
});

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
      padding: 12px;
      border-radius: 6px;
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
