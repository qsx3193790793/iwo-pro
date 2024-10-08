// 数据缓存仓库
import Vue from "vue";

let store = {
  namespaced: true,
  moduleName: 'storage',
  state: {
    storage: {},
    navSetting: {//导航设置
      canCollapse: !1,//是否可以伸缩
      isCollapse: !1,//是否伸缩
    },
    activeTabs: [{
      name: '工作台',
      routeName: 'Index',
      key: '工作台',
      path: '/layout/index',
      closable: !1,//是否可关闭
      isActive: !0,//活动状态
    }],//记录活动标签
  },
  mutations: {
    SET_NAV_SETTING(state, payload) {
      state.navSetting = Object.assign({}, state.navSetting, payload);
    },
    ADD_TAB(state, payload) {
      const finder = state.activeTabs.find(at => at.key === payload.key || (at.tabId && (at.tabId === payload.tabId)));
      console.log('ADD_TAB', payload, payload.tabId, finder)
      //刷标记未非活动
      this.commit('storage/SET_TABS_ACTIVE_STATUS', !1);
      //如果存在 激活标签 不存在 添加标签
      finder ? Object.assign(finder, {isActive: !0}) : state.activeTabs.push(payload);
    },
    CHANGE_TAB(state, payload) {
      const finder = state.activeTabs.find(at => at.key === payload.key && at.multiId === payload.multiId);//找到坐标
      finder.isActive = !0;
      Vue.prototype.$$router.replace({name: finder.routeName, query: finder.query, params: finder.params});
    },
    REMOVE_TAB(state, payload) {
      const finder = state.activeTabs.find(at => at.key === payload || (at.tabId && (at.tabId === payload)));//找到坐标
      const finderIndex = state.activeTabs.findIndex(at => at.key === payload || (at.tabId && (at.tabId === payload)));//找到坐标
      const isActive = state.activeTabs[finderIndex]?.isActive || !1;//记录是否是活动标签
      this.dispatch('keepAlive/REMOVE_ALIVE_PAGE', [finder.routeName]);
      state.activeTabs.splice(finderIndex, 1);//删除
      if (isActive) {//如果是活动标签 则标记他上一个为活动
        const tab = state.activeTabs[finderIndex - 1];
        tab.isActive = !0;
        Vue.prototype.$$router.replace({name: tab.routeName, query: tab.query, params: tab.params});
      }
    },
    CLEAR_TABS(state, payload) {
      state.activeTabs.splice(1, state.activeTabs.length);
      const tab = state.activeTabs[0];
      this.dispatch('keepAlive/REMOVE_ALL_ALIVE_PAGE');
      if (!tab.isActive) {
        tab.isActive = !0;
        Vue.prototype.$$router.replace({name: tab.routeName, query: tab.query, params: tab.params});
      }
    },
    SET_TABS_ACTIVE_STATUS(state, payload = !1) {
      state.activeTabs.forEach(at => at.isActive = payload);
    },
    SET_STORAGE(state, payload) {
      state.storage[payload.key] = payload.value;
      sessionStorage.setItem('__storage__', JSON.stringify(state.storage));
    },
    REMOVE_STORAGE(state, keys) {
      (keys || []).forEach(k => delete state.storage[k]);
      sessionStorage.setItem('__storage__', JSON.stringify(state.storage));
    },
    CHECK_STORAGE(state, payload) {
      state.storage = JSON.parse(sessionStorage.getItem('__storage__') || '{}');
    },
  },
  actions: {},
  getters: {
    GET_STORAGE_BY_KEY: state => key => state.storage[key] || null,
    GET_ACTIVE_TABS: state => state.activeTabs || null,
    GET_TAB_BY_ID: state => tabId => state.activeTabs.find(at => at.tabId === tabId),
    GET_MULTI_TABS: state => state.activeTabs.filter(at => at.isMultiTab),
    GET_ACTIVE_TAB_KEY: state => state.activeTabs.find(at => at.isActive)?.key,
    GET_NAV_SETTING_IS_COLLAPSE: state => state.navSetting.isCollapse,
    GET_NAV_SETTING_CAN_COLLAPSE: state => state.navSetting.canCollapse,
  },
};

export {store};
