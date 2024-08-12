//统一postMessage 封装类

import Vue from "vue";

class PostMessageUtils {
  constructor(app) {
    this.handlers = {};//监听方法集合
    this.init();
  }

  init() {
    Vue.prototype.$$addEvent(window, 'message', event => {
      Object.keys(this.handlers).forEach(key => key === event.data.target && this.handlers[key](event.data));
    });
  }

  //发送数据 origin发送至的数据源 message数据=object targetOrigin=验证域
  postMessage(origin, message, targetOrigin = '*') {
    origin && origin.postMessage(message, targetOrigin);
  }

  //添加监听一个消息源   target监听目标 唯一标识，handler触发的回调
  add(target, handler) {
    if (!target || !handler) return;
    this.handlers[target] = handler;
  }

  //移除监听来源
  remove(target) {
    if (!target) return;
    delete this.handlers[target];
  }

  //移除所有监听来源
  removeAll() {
    this.handlers = {};
  }
}

export default PostMessageUtils;
