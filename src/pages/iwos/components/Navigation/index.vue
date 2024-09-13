<template>
  <div class="Navigation" ref="secNavRef">
    <div class="main-nav">
      <!-- 分析：拆分模块：顶部区域，底部区域（又可拆分出：左侧区域，左侧中区域，右侧区域） -->
      <!-- ELScrollbar 实现操作时的动态效果 -->
      <!-- 考虑到激活状态，会在点击时进行记录，通过如果知道当前导航有下级导航，则记录下展开状态 -->
      <!-- class的动态，可以定义:class实现 -->
      <ELScrollbar>
        <div v-for="v in navigation" :key="v.name" class="item" :class="{active:v.name===(secNavigation?.name||$route.meta.belong)}" @click="handlerSecNavChange(v)">
          <i v-if="v.meta?.icon" class="iconfont" :class="v.meta.icon"></i>
          <span v-if="v.meta?.title">{{ v.meta.title }}</span>
        </div>
      </ELScrollbar>
    </div>
    <div id="secNavRef" v-if="secNavigation?.children?.length" class="sec-nav" :style="{width:$store.getters['storage/GET_NAV_SETTING_IS_COLLAPSE']?'0.64rem':'2.21rem'}">
      <div class="top">
        <i v-if="secNavigation.meta?.icon" class="iconfont" :class="secNavigation.meta.icon"></i>
        <template v-if="!$store.getters['storage/GET_NAV_SETTING_IS_COLLAPSE']">{{ secNavigation.meta.title }}</template>
      </div>
      <ELScrollbar class="bottom">
        <el-menu :collapse="$store.getters['storage/GET_NAV_SETTING_IS_COLLAPSE']" :collapse-transition="!1" :default-active="$route.meta?.parentName||$route.name" @select="handleSelect">
          <template v-for="(v,i) in secNavigation.children">
            <SubMenu v-if="v.children?.length" :key="v.name" :menu="v"></SubMenu>
            <el-menu-item v-else :index="v.name" :data-index="v.name" :data-active="$route.name">
              <i v-if="v.meta?.icon" class="iconfont" :class="v.meta.icon"></i>
              <span slot="title">{{ v.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </ELScrollbar>
    </div>
  </div>
</template>
<script setup>
import SubMenu from "./SubMenu";
import {computed, ref, getCurrentInstance, watchEffect, onBeforeMount, watch, nextTick} from "vue";

const router = {};
const {proxy} = getCurrentInstance();

function checkRoute() {
  const tabId = proxy.$route.query.tabId;
  const finderTab = tabId ? proxy.$store.getters['storage/GET_TAB_BY_ID'](tabId) : null;
  const tab = finderTab || {
    name: proxy.$route.meta.name,
    routeName: proxy.$route.name,
    query: proxy.$route.query,
    params: proxy.$route.params,
    key: proxy.$route.meta.name + tabId,
    path: proxy.$route.path,
    closable: !0,//是否可关闭
    isActive: !0,//活动状态
    isMultiTab: proxy.$route.meta.isMultiTab,//多开标签
    tabId: proxy.$route.query.tabId
  };
  console.log('checkRoute', proxy.$route, tab);
  proxy.$$store.commit('storage/ADD_TAB', tab);
}

function handleSelect(name) {
  const finder = proxy.$$router.getRoutes().find(r => r.name === name);
  if (!finder) return proxy.$$Toast.error('访问页面不存在');
  proxy.$$router.push({name: name, query: {tabId: finder.meta.isMultiTab ? proxy.$$getUUID() : ''}});
}

const navigation = ref([]);

const secNavigation = ref(null);

function handlerSecNavChange(v) {
  proxy.$store.commit('storage/SET_NAV_SETTING', {canCollapse: !!v.children?.length});
  if (v.children) return secNavigation.value = v;
  secNavigation.value = null;
  const finder = proxy.$$router.getRoutes().find(r => r.name === v.name);
  if (!finder) return proxy.$$Toast.error('访问页面不存在');
  proxy.$$router.push({name: v.name});
  proxy.$$router.push({name: v.name, query: {tabId: finder.meta.isMultiTab ? proxy.$$getUUID() : ''}});

}

function triggerNav() {
  secNavigation.value = navigation.value.find(mn => mn.name === proxy.$route.meta.belong);
  proxy.$store.commit('storage/SET_NAV_SETTING', {canCollapse: !!secNavigation.value?.children?.length});
}

async function getRouters() {
  // return navigation.value = require('./mock.json');
  const {res, err} = await proxy.$$api.menu.getRouters();
  if (err) return;
  navigation.value = res?.list?.[0]?.children || [];
  nextTick(() => {
    triggerNav();
    checkRoute();
  });
}

onBeforeMount(() => {
  getRouters();
});

watch(() => proxy.$route.name, () => {
  triggerNav();
  checkRoute();
});

const secNavRef = ref();

</script>
<style lang="scss" scoped>
.Navigation {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 21, 41, .1);
  z-index: 2;

  & > .main-nav {
    padding-top: 20px;
    width: $main-nav-width;
    background-color: $main-color;
    overflow: hidden;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      padding: 12px 0;
      cursor: pointer;

      & > .iconfont {
        font-size: 32px;
        margin-bottom: 6px;
        font-weight: normal;
      }

      & > span {
        font-size: 14px;
      }

      &:hover, &.active {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  & > .sec-nav {
    transition: width .2s ease-out 0s;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: rgba(237, 244, 254, 1);
    //width: var(--w);
    overflow: hidden;

    & > .top {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: $tab-height;
      font-size: 15px;
      border-bottom: 1PX solid rgba(225, 229, 240, 1);
      padding-left: 20px;
      font-weight: bold;
      flex-shrink: 0;
      flex-grow: 0;
      white-space: nowrap;
    }

    & > .bottom {
      flex-grow: 1;
      overflow: hidden;
    }
  }
}

</style>
