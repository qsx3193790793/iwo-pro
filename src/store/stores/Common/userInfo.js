//用户信息 公共store

import Vue from "vue";

let store = {
  namespaced: true,
  moduleName: 'user',
  state: {
    urlParams: {},//url跳转过来的参数集合
    token: '',
    expiresIn: null,
    bizData: null,//单点数据
    permissions: [],
    roles: [],
    userInfo: null,
  },
  mutations: {
    SET_URL_PARAMS(state, urlParams) {
      const assignUrlParams = Object.assign(state.urlParams, urlParams || {});
      sessionStorage.setItem("urlParams", JSON.stringify(assignUrlParams));
      state.urlParams = assignUrlParams;
    },
    SET_TOKEN(state, token) {
      localStorage.setItem("token", token);
      state.token = token;
    },
    SET_EXPIRES_IN(state, expiresIn) {
      sessionStorage.setItem("expiresIn", expiresIn);
      state.expiresIn = expiresIn;
    },
    SET_PERMISSIONS(state, permissions) {
      sessionStorage.setItem("permissions", JSON.stringify(permissions));
      state.permissions = permissions;
    },
    SET_ROLES(state, roles) {
      sessionStorage.setItem("roles", JSON.stringify(roles));
      state.roles = roles;
    },
    SET_USER_INFO(state, userInfo) {
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      state.userInfo = userInfo;
    },
    SET_BIZ_DATA(state, bizData) {
      sessionStorage.setItem("bizData", JSON.stringify(bizData));
      state.bizData = bizData;
    },
  },
  actions: {
    CHECK_STORAGE({state, commit}, payload) {
      commit("SET_TOKEN", localStorage.getItem('token') || '');
      commit("SET_URL_PARAMS", JSON.parse(sessionStorage.getItem('urlParams') || '{}'));
      commit("SET_EXPIRES_IN", sessionStorage.getItem('expiresIn'));
      commit("SET_USER_INFO", JSON.parse(sessionStorage.getItem('userInfo') || 'null'));
      commit("SET_BIZ_DATA", JSON.parse(sessionStorage.getItem('bizData') || 'null'));
      commit("SET_PERMISSIONS", JSON.parse(sessionStorage.getItem('permissions') || '[]'));
      commit("SET_ROLES", JSON.parse(sessionStorage.getItem('roles') || '[]'));
    },
    DO_LOGIN({state, commit}, userInfo) {
      return new Promise(async (resolve, reject) => {
        if (userInfo.isSsoAuth) {
          const {res, err} = await Vue.prototype.$$api.login.ssoAuth({params: {p: userInfo.p}});
          if (res) {
            commit('SET_TOKEN', res.access_token);
            commit('SET_EXPIRES_IN', res.expires_in);
            commit('SET_BIZ_DATA', res.bizData);
            return resolve(res.redirectUrl);
          }
          return reject(err);
        }
        const username = Vue.prototype.$$encrypt(userInfo.username.trim());
        const password = Vue.prototype.$$encrypt(userInfo.password.trim());
        const code = userInfo.code
        const uuid = userInfo.uuid
        const {res, err} = await Vue.prototype.$$api.login.login({data: {username, password, code, uuid}});
        if (res) {
          commit('SET_TOKEN', res.access_token);
          commit('SET_EXPIRES_IN', res.expires_in);
          return resolve();
        }
        reject(err);
      })
    },
    // 获取用户信息
    DO_GET_USERINFO({commit, state}) {
      return new Promise(async (resolve, reject) => {
        const {res, err} = await Vue.prototype.$$api.login.getInfo();
        if (res) {
          commit('SET_ROLES', res.roles?.length ? res.roles : ['ROLE_DEFAULT']);
          commit('SET_PERMISSIONS', res.permissions);
          commit('SET_USER_INFO', res.user)
          return resolve();
        }
        reject(err);
      })
    },
    // 刷新token
    REFRESH_TOKEN({commit, state}) {
      return new Promise(async (resolve, reject) => {
        const {res, err} = await Vue.prototype.$$api.login.refreshToken(state.token);
        if (res) {
          commit('SET_EXPIRES_IN', res.data)
          return resolve();
        }
        reject(err);
      })
    },
    // 登出
    DO_LOGOUT({commit, state}) {
      return new Promise(async (resolve, reject) => {
        const {res, err} = await Vue.prototype.$$api.login.logout();
        if (err) return reject();
        sessionStorage.clear();
        localStorage.clear();
        commit('storage/CLEAR_TABS', null, {root: !0});
        Vue.prototype.$$router.replace({name: 'Login'});
        return resolve();
      })
    },
  },
  getters: {
    GET_URL_PARAMS: state => state.urlParams,
    GET_URL_PARAMS_BY_KEY: state => key => state.urlParams[key] || null,
    GET_TOKEN: state => state.token,
    GET_USER_INFO: state => state.userInfo || null,
    GET_BIZ_DATA: state => state.bizData || null,
    GET_PERMISSIONS: state => state.permissions || [],
  }
};

export {store};
