//axios 配置
import axios from 'axios';
import qs from "qs";
import Vue from "vue";

const CancelToken = axios.CancelToken;

let cancel = {};

const axiosInstance = axios.create({
  headers: {},
});

//增加请求拦截
axiosInstance.interceptors.request.use(
  config => {
    //需要取消的接口
    if (config['cancelId']) {
      // 先对接口取消
      cancel[config['cancelId']] && cancel[config['cancelId']]();
      delete cancel[config['cancelId']];
      // 添加cancel
      config.cancelToken = new CancelToken(c => {
        cancel[config['cancelId']] = c;
      });
    }

    if (config.contentType === 0 && config.method.toLocaleLowerCase() === 'get' && config.params) {
      config.url = (config.url + '?' + Vue.prototype.$$tansParams(config.params)).slice(0, -1);
      config.params = {};
    }

    if (config.contentType === 1) config.data = qs.stringify(config.data);
    if (config.contentType === 2) {
      config.data = Vue.prototype.$$toFormData(config.data);
    }
    //设置超时
    config.timeout = 10 * 60 * 1000;
    //设置请求格式
    config.headers['Content-Type'] = ['application/json;charset=UTF-8', 'application/x-www-form-urlencoded;charset=UTF-8', 'multipart/form-data;charset=UTF-8'][config.contentType];
    config.headers['Authorization'] = `Bearer ${Vue.prototype.$$store.getters['user/GET_TOKEN']}`;

    return config;
  },
  err => {
    return Promise.reject({code: '-1', desc: '网络异常，请检查您的网络设置'});
  }
);

let resInterceptors = response => {
  if (!response) return {code: '-1', desc: '网络异常，请检查您的网络设置'};
  if (response.__CANCEL__) return {code: '-2', desc: '已取消'};
  if (response.status !== 200) return {code: response?.data?.code || response.status, desc: response.data.desc || response.data.msg || response?.data?.message || '接口异常，请稍后再试'};
  return {code: response.data.code, desc: response.data.desc || response.data.msg || response.data.message, data: response.data.data, timestamp: response.data.timestamp};
};

const getOuterData = response => {
  return Object.keys(response.data).reduce((o, i) => (!['code', 'msg', 'data'].includes(i) && (o[i] = response.data[i]), o), {})
}
//增加响应拦截
axiosInstance.interceptors.response.use(
  response => {
    // 网络结果200返回resolve
    if (response.status === 200) {
      // return {code: '200', data: response.data || '', message: 'success'}
      // if (response.config.requestType === 'json') response.data = {code: '200', data: response.data, message: 'success'};
      if (Object.prototype.toString.call(response.data) === '[object Blob]') return {data: {blob: response.data, headers: response.headers}, code: '200', message: 'success'};
      //业务逻辑200
      if (response.data.code == '200' || response.data.errcode == 0) {
        if (Vue.prototype.$$getVariableType(response.data.data) === '[object Array]') response.data.data = {list: response.data.data, ...getOuterData(response)};
        if (Vue.prototype.$$getVariableType(response.data.data) === '[object Object]') Object.assign(response.data.data, {reqOuterData: getOuterData(response)});
        if (response.data.data === undefined) response.data.data = getOuterData(response);//兼容若依部分接口 数据不在data里
        console.log('interceptorOK->200', response.config.url, response.data);
        return response.data;
        //业务数据不能为null
        // if (response.data.data) return response.data;
      }
      // if (response.config.downloadFile) {
      //   return {data: response.data, headers: response.headers};
      // }
    }
    // 非200返回reject
    console.log('interceptorOK->!=200', response.config.url, response.data);
    return Promise.reject(resInterceptors(response));
  },
  err => {
    console.log('interceptorERR-Cancel->', err, err.__CANCEL__);
    if (err.__CANCEL__) return Promise.reject(resInterceptors(err));
    console.log('interceptorERR->', err, err.config.url, err.response);
    return Promise.reject(resInterceptors(err.response));
  },
);

export default axiosInstance;
