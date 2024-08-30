//字典集合 store

import Vue from "vue";

let store = {
  namespaced: true,
  moduleName: 'dictionaries',
  state: {
    dictionaries: {},
  },
  mutations: {
    // 缓存字典
    SET_DICTIONARIES(state, params) {// params ={xxx:[{label:'xxx',value:'xxx'},...]}
      // state.dictionaries = Object.assign(state.dictionaries, params);
      //不这么写不更新视图 有点奇怪？
      Vue.set(state, 'dictionaries', Object.assign({}, state.dictionaries, params));
    },
    // 清空所有字典
    RESET_ALL_DICTIONARIES(state) {
      // state.dictionaries = {};
      Vue.set(state, 'dictionaries', {});
    }
  },
  actions: {
    GET_DICTIONARIES({dispatch, commit, state}, payload) {
      return new Promise((rs, rj) => {
        payload.dicts.forEach(dictType => {
          // if (state.dictionaries?.[dictType]?.length) return;//字典已存在 pass
          Vue.prototype.$$api[payload.type || 'dict']?.getDicts({loading: !1, dictType}).then(({res, err}) => {
            if (err) return;
            //存档字典
            commit('SET_DICTIONARIES', {
              [dictType]: payload.type === 'dict'
                ? (res?.list || []).map(r => ({label: r.dictLabel, value: r.dictValue, key: r.dictValue}))
                : (res?.dataList || []).sort((a, b) => a.dictSort - b.dictSort).map(r => ({label: r.dictLabel, value: r.dictValue, key: r.dictValue}))
            });
            rs(res);
          }).catch(() => rj(dictType))
        })
      });
    },
  },
  getters: {
    GET_DICT: state => dictName => state.dictionaries[dictName] || [],
    MATCH_LABEL: state => (dictName, value, sp = '，') => {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        if (!value.length) return '-';
        return state.dictionaries?.[dictName || '']?.filter(d => value.map(v => v.toString()).includes(d.value.toString())).map(d => d.label).join(sp);
      }
      return state.dictionaries?.[dictName || '']?.find(d => d.value.toString() == value?.toString())?.label || '-';
    },
    MATCH_VALUE: state => (dictName, label, sp = '，') => {
      if (Object.prototype.toString.call(label) === '[object Array]') {
        if (!label.length) return '-';
        return state.dictionaries?.[dictName || '']?.filter(d => label.map(v => v.toString()).includes(d.label.toString())).map(d => d.value).join(sp);
      }
      return state.dictionaries?.[dictName || '']?.find(d => d.label.toString() == label?.toString())?.value || '-';
    },
  }
}

export {store};
