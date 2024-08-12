import axios from '@/axios';
import codeCenter from './codeCenter';
import Vue from "vue";

//记录多接口loading
let loadingInstance = null;
const loadingIdCollect = {};

//处理关闭loading逻辑
const closeLoading = loadingId => {
  delete loadingIdCollect[loadingId];
  console.log('loadingIdCollect close', loadingId, loadingIdCollect, loadingInstance)
  if (Object.keys(loadingIdCollect).length <= 0) {
    loadingInstance?.close();
    loadingInstance = null;
  }
};
//打开loading逻辑
const openLoading = loadingId => {
  loadingIdCollect[loadingId] = 'open';
  console.log('loadingIdCollect open', loadingId, loadingIdCollect, loadingInstance)
  if (Object.keys(loadingIdCollect).length <= 1) loadingInstance = Vue.prototype.$$Loading();
};

//统一处理 status不为200都视为500
const errorProcessor = (err, errorMessage, isOnErrorBack, loadingId) => {
  closeLoading(loadingId);
  console.log('errorProcessor', err)
  let code_ftn = codeCenter['code_' + err.code];
  if (code_ftn) return code_ftn(err, errorMessage, isOnErrorBack);
  return codeCenter.other(err, errorMessage, isOnErrorBack);
};

const getCacheKey = args => {
  const cacheData = (args.method.toUpperCase() === 'GET' ? JSON.stringify(args.params || {}) : JSON.stringify(args.data || {})).replace(/\'|\"|\:|\,|，|\[|\]|\{|\}/g, '|');
  return `${args.requestUrl}_${args.method.toUpperCase()}_${cacheData}`;
}

/*
传参说明
args = {
  method String 请求类型 默认POST
  contentType Integer 请求类型 默认0  0='application/json'  1='application/x-www-form-urlencoded; charset=UTF-8' 2='multipart/form-data'
  requestUrl String 请求地址
  requestType String 请求类型 默认接口 ‘json’=json文件
  data object post提交数据
  params String get提交数据
  hasCancel Boolean 默认false 重复请求相同接口时 是否取消上一个请求 需要配置cancelId
  cancelId String 用于取消请求 每个接口唯一 post会默认取接口名 所以可以不传 ，get请求需要自己传
  loading Boolean 默认true 请求时是否出现loading
  isOnErrorBack Boolean 默认false 错误弹窗后点击确认 自动返回  'publicBack'=调用三端返回 其他真值=返回上一页
  isErrDialog Boolean 默认true 请求错误时是否弹窗  弹出顺序errorMessage||data||desc
  successMessage String 请求成功提示 默认为空不提示
  errorMessage String 请求失败提示 默认为空不提示
}
*/
export default (args) => {
  console.log('beforeAxios->', args.requestUrl || '', args);
  // 缓存接口 默认10分钟
  if (args.cache) {
    const cache = Vue.prototype.$$store.getters['storage/GET_STORAGE_BY_KEY'](getCacheKey(args));
    if (cache && Vue.prototype.$$dayjs().isBefore(Vue.prototype.$$dayjs(cache.expireDate))) {
      //请求参数相同并且没过期
      return new Promise((resolve, reject) => {
        resolve({res: cache.res, timestamp: Vue.prototype.$$dayjs().valueOf(), err: null, canceled: false});
      });
    }
  }
  return new Promise((resolve, reject) => {
    const loadingId = Vue.prototype.$$getUUID();
    //开启loading
    args.loading !== false && openLoading(loadingId);
    axios({
      method: args.method || 'POST',
      url: args.requestUrl,
      contentType: args.contentType || 0,
      responseType: args.responseType || 'json',
      requestType: args.requestType,
      downloadFile: args.downloadFile,
      data: args.data,
      headers: args.headers || {},
      params: Object.assign({}, args.params || {}),//, {_t: new Date().getTime()}
      cancelId: (args.hasCancel === undefined ? false : args.hasCancel) ? (args.method.toUpperCase() === 'POST' ? args.requestUrl : args.cancelId) : null,
    }).then(res => {
      const d = ['[object String]', '[object Number]', '[object Boolean]'].includes(Vue.prototype.$$getVariableType(res.data)) ? {value: res.data} : (res.data || {});
      const timestamp = Number(`${(res.timestamp || res.serverTime)}000`.substring(0, 13));
      setTimeout(() => {
        if (args.cache) {
          Vue.prototype.$$store.commit('storage/SET_STORAGE', {key: getCacheKey(args), value: {res: d, expireDate: Vue.prototype.$$dayjs().valueOf() + (args.cache?.expire || 1000 * 60 * 10)}});
        }
        resolve({res: d, timestamp, err: null, canceled: false});
      }, 1);
    }).catch(err => {
      // 当填了errorMessage才会进行错误弹窗 优先从接口获得错误提示，如果没有用填写的
      if (err.code === '-2') return setTimeout(() => resolve({res: null, timestamp: null, err: null, canceled: true}), 1);//取消直接返回
      if (args.isErrDialog === false) return resolve({res: null, err, canceled: false});//不处理弹窗
      errorProcessor(err, args.errorMessage, args.isOnErrorBack, loadingId) && setTimeout(() => resolve({res: null, err, canceled: false}), 1);//当错误处理完成时 返回是否需要回调
    }).finally(() => {
      args.loading !== false && closeLoading(loadingId);//关闭loading
    });
  });
};
