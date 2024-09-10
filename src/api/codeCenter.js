//接口返回code统一处理

import Vue from "vue";

const getMessage = function (err, errorMessage) {
  if (errorMessage) return errorMessage;
  if (Vue.prototype.$$getVariableType(err.data) === '[object String]' && err.data) return err.data;
  if ((Vue.prototype.$$getVariableType(err.data) === '[object Object]')) {
    if (err.data.error) return err.data.error;//兼容对象  以后有一个添加一个
  }
  return err.desc || '系统繁忙，请稍后再试';
}

let isOnErrDialog = !1;//是否已经出发错误弹窗 只弹一次

export default {
  //特殊处理
  'code_-1': (err, errorMessage, isOnErrorBack) => {
    const message = getMessage(err, errorMessage);
    message && !isOnErrDialog && Vue.prototype.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => isOnErrorBack && (isOnErrorBack === 'publicBack' ? history.back() : Vue.prototype.$$router.back())).finally(() => isOnErrDialog = !1);
    return !isOnErrorBack;
  },
  'code_-3': (err, errorMessage, isOnErrorBack) => {
    const message = getMessage(err, errorMessage);
    message && !isOnErrDialog && Vue.prototype.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => isOnErrorBack && (isOnErrorBack === 'publicBack' ? history.back() : Vue.prototype.$$router.back())).finally(() => isOnErrDialog = !1);
    return !isOnErrorBack;
  },
  'code_401': (err, errorMessage) => {
    console.log('code_402', err);
    const message = getMessage(err, errorMessage);
    message && !isOnErrDialog && Vue.prototype.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => {
    }).finally(() => {
      isOnErrDialog = !1;
      Vue.prototype.$$router.replace({name: 'Login'});
    });
    isOnErrDialog = !0;
    return false;
  },
  // 'code_403': (err, errorMessage) => {//无访问权限
  //   console.log('code_402', err);
  //   const message = getMessage(err, errorMessage);
  //   message && !isOnErrDialog && Vue.prototype.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => {
  //   }).finally(() => {
  //     Vue.prototype.$$store.commit('storage/REMOVE_TAB', Vue.prototype.$$router.currentRoute.meta.name);
  //     Vue.prototype.$$router.replace({name: 'Index'});
  //     isOnErrDialog = !1
  //   });
  //   isOnErrDialog = !0;
  //   return false;
  // },
  // 'code_1001': (err, errorMessage) => {
  //   console.log('code_1002', err);
  //   const message = getMessage(err, errorMessage);
  //   message && !isOnErrDialog && globalProperties.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => {
  //     globalProperties.$$router.replace({name: 'Login'});
  //   }).finally(() => isOnErrDialog = !1);
  //   isOnErrDialog = !0;
  //   return false;
  // },
  // 'code_1002': (err, errorMessage) => {
  //   console.log('code_1002', err);
  //   const message = getMessage(err, errorMessage);
  //   message && !isOnErrDialog && globalProperties.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => {
  //     globalProperties.$$router.replace({name: 'Login'});
  //   }).finally(() => isOnErrDialog = !1);
  //   isOnErrDialog = !0;
  //   return false;
  // },
  // 'code_10002': (err, errorMessage) => {
  //   console.log('code_1002', err);
  //   const message = getMessage(err, errorMessage);
  //   message && !isOnErrDialog && globalProperties.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => {
  //     globalProperties.$$router.replace({name: 'Login'});
  //   }).finally(() => isOnErrDialog = !1);
  //   isOnErrDialog = !0;
  //   return false;
  // },
  'code_10001': (err, errorMessage) => {
    console.log('code_10001', err);
    const message = getMessage(err, errorMessage);
    message && !isOnErrDialog && Vue.prototype.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => {
      Vue.prototype.$$router.replace({name: 'Login'});
    }).finally(() => isOnErrDialog = !1);
    isOnErrDialog = !0;
    return false;
  },
  'other': (err, errorMessage, isOnErrorBack) => {
    const message = getMessage(err, errorMessage);
    message && !isOnErrDialog && Vue.prototype.$$Dialog({title: '提示', showCancelButton: false, message}).then(() => isOnErrorBack && (isOnErrorBack === 'publicBack' ? history.back() : Vue.prototype.$$router.back())).finally(() => isOnErrDialog = !1);
    isOnErrDialog = !0;
    return !isOnErrorBack;
  },
}
