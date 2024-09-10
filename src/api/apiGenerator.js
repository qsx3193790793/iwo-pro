// api封装器
import doRequest from '@/api/config';
import Vue from "vue";

export default (apis) => Object.keys(apis).reduce((t, key) => ((t[key] = (args = {}) => {
  const url = Vue.prototype.$$getVariableType(apis[key].url) === '[object Function]' ? apis[key].url(args) : apis[key].url;
  return doRequest({
    method: apis[key].method || 'POST',
    requestUrl: Vue.prototype.$$getQueryifyUrl(url, args.query, false),
    contentType: apis[key].contentType,
    responseType: apis[key].responseType,
    loading: args.loading,
    data: args.data || {},
    params: Object.assign({}, args.params || {}, {_t: +new Date()}),
    cache: apis[key].cache || null,
    isErrDialog: args.isErrDialog,
    errorMessage: args.errorMessage,
    successMessage: args.successMessage,
    isOnErrorBack: args.isOnErrorBack,
    downloadFile: args.downloadFile,
    headers: Object.assign({}, apis[key].headers || {}, args.headers || {}),
  });

}), t), {});
