//keepAlive 页面配置 store

let store = {
  namespaced: true,
  moduleName: 'keepAlive',
  state: {
    alivePage: [],
  },
  mutations: {
    SET_ALIVE_PAGE(state, aivePage) {
      state.alivePage = aivePage
    }
  },
  actions: {
    ADD_ALIVE_PAGE({state, commit}, route) {
      const hasAlivePage = !!state.alivePage.find(ap => ap.name === route.name);
      if (!hasAlivePage) {
        commit('SET_ALIVE_PAGE', [].concat(state.alivePage, [{name: route.name, pageLevel: route.meta.pageLevel || -1}]));
      }
    },
    REMOVE_ALIVE_PAGE({state, commit}, names) {
      commit('SET_ALIVE_PAGE', state.alivePage.filter(ap => !names.includes(ap.name)));
    },
    REMOVE_ALL_ALIVE_PAGE({state, commit}) {
      console.log('REMOVE_ALL_ALIVE_PAGE');
      commit('SET_ALIVE_PAGE', []);
    }
  },
  getters: {
    GET_ALIVE_PAGE: state => state.alivePage.map(ap => ap.name),
  }
}

export {store};
