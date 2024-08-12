//表单集合 store

import Vue from "vue";

let store = {
  namespaced: true,
  moduleName: 'formData',
  state: {
    formDataCollect: {}
  },
  mutations: {
    // 缓存一个表单
    SET_FORM_DATA(state, params) {// params ={xxx:{name:'xxx',idcard:'xxx'}}
      state.formDataCollect = Object.assign(state.formDataCollect, params);
    },
    // 重置某个表单内容
    CLEAR_FORM_DATA(state, params) {// params ={key:'x',filterKeys:[],excludeKeys:[]}
      if (!params.key || !state.formDataCollect[params.key]) return;
      Vue.prototype.$$resetFormFields(state.formDataCollect[params.key], params['filterKeys'], params['excludeKeys']);
    },
    // 清空所有缓存表单
    RESET_ALL_FORM_DATA(state) {
      state.formDataCollect = {};
    }
  },
  actions: {},
  getters: {
    GET_FORM_DATA: state => state.formDataCollect,
    GET_FORM_DATA_BY_KEY: state => key => state.formDataCollect[key] || null,
  }
}

export {store};
