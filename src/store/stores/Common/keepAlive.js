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
      console.log('ADD_ALIVE_PAGE', route)
      const hasAlivePage = !!state.alivePage.find(ap => ap.name === route.name);
      if (!hasAlivePage) {
        commit('SET_ALIVE_PAGE', [].concat(state.alivePage, [{name: route.name, pageLevel: route.meta.pageLevel || -1}]));
        console.log('ADD_ALIVE_PAGE', state.alivePage)
      }
    },
    REMOVE_ALIVE_PAGE({state, commit}, route) {
      console.log('REMOVE_ALIVE_PAGE', route)
      commit('SET_ALIVE_PAGE', state.alivePage.filter(ap => ap.pageLevel < route.meta.pageLevel));
      console.log('REMOVE_ALIVE_PAGE', state.alivePage)
    }
  },
  getters: {
    GET_ALIVE_PAGE: state => state.alivePage.map(ap => ap.name),
  }
}

export {store};
