import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default storesContext => {

  let stores = [];
// 遍历store
  storesContext.forEach(cs => {
    cs.keys().forEach(filename => {
      stores.push(cs(filename).store);
    });
  });

  let modules = {};
  stores.forEach(store => {
    modules[store.moduleName] = store
  });

  console.log('store modules', modules);

  return new Vuex.Store({modules});
}
