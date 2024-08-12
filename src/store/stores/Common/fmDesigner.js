// FMDesigner缓存仓库
import Vue from "vue";

let store = {
  namespaced: true,
  moduleName: 'fmDesigner',
  state: {
    activeCompId: null,
    history: [],
    formHistory: []
  },
  mutations: {
    SET_ACTIVE_COMP_ID(state, id) {
      state.activeCompId = id || null;
    },
    ADD_HISTORY(state, stage) {
      state.history.push(stage);
      console.log('ADD_HISTORY', state.history);
    },
    ADD_FORM_HISTORY(state, form) {
      state.formHistory.push(form);
      console.log('ADD_FORM_HISTORY', state.formHistory);
    },
  },
  actions: {},
  getters: {
    GET_ACTIVE_COMP_ID: state => state.activeCompId || null,
    GET_HISTORY: state => state.history || [],
    GET_FORM_HISTORY: state => state.formHistory || [],
  },
};

export {store};
