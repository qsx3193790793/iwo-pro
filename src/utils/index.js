import deepmerge from 'deepmerge';
import qs from 'qs';
import dayjs from 'dayjs';
import ResizeObserver from 'resize-observer-polyfill';
import cryptoJs from "crypto-js";
import mitt from "mitt";
import lodash from "lodash";
import Clipboard from 'clipboard';
// import SM4 from 'gm-crypt';
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
import {saveAs} from 'file-saver';
import Vue from "vue";

//加密串
const $$ENCRYPT_CODES = '{^QWcv)d90@sXC24\\nw%eaU!&VB?Nui8`~_Mzx=S6A;LK>/JHGy-opl<.b(I5+ER[kj\'FD7#TY]|OPhg:Z3m1*fq$rt\",}'; //用户信息加密串

//设备类型
const $$OS_TYPE = /Android/.test(navigator.userAgent) ? 1 : (/(iPhone|iPod|iPad|iOS)/.test(navigator.userAgent) ? 2 : 3);//系统类型

//游览器检查 设置事件名称 pc鼠标事件 移动端touch事件
const $$MOUSE_EVENT = {
  DOWN: $$OS_TYPE !== 3 ? 'touchstart' : 'mousedown', UP: $$OS_TYPE !== 3 ? 'touchend' : 'mouseup', MOVE: $$OS_TYPE !== 3 ? 'touchmove' : 'mousemove'
};

// sm4加密
// const $$sm4 = new SM4.sm4({key: process.env.VUE_APP_SM4_KEY, mode: process.env.VUE_APP_SM4_MODE, cipherType: process.env.VUE_APP_SM4_CIPHER_TYPE, iv: process.env.VUE_APP_SM4_IV});

// 添加时间插件 格式化时间
const $$dayjs = dayjs;
const $$dateFormatter = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '-';
  return dayjs(date || null).format(formatStr);
}
const $$dateFormatterYMDHMS = date => date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-';
const $$dateFormatterYMD = date => date ? dayjs(date).format('YYYY-MM-DD') : '-';

// 事件bus
const $$emitter = mitt();

//lodash
const $$lodash = lodash;

//禁用原生toFixed
// Number.prototype.toFixed = function (len, type = 1) {
//   returnconst $$decimal(this).toFixed(len, [Decimal.ROUND_UP, Decimal.ROUND_DOWN, Decimal.ROUND_CEIL, Decimal.ROUND_CEIL][type]);
// };

// 延时方法
const $$sleep = (delay = 1000) => new Promise((resolve, reject) => setTimeout(() => resolve(), delay));

//空方法
const $$emptyFn = () => {
};

//空方法
const $$resetForm = (refName, DataObj) => {
  if (DataObj[refName]) {
    DataObj[refName].resetFields();
  }
};

//添加日期范围
const $$addDateRange = (params, dateRange, propName) => {
  let search = params;
  search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') {
    search.params['beginTime'] = dateRange[0];
    search.params['endTime'] = dateRange[1];
  } else {
    search.params['begin' + propName] = dateRange[0];
    search.params['end' + propName] = dateRange[1];
  }
  return search;
};

const $$tansParams = (params) => {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    let part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']';
            let subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
}

const $$fileSaveAs = (data, fileName) => {
  if (data.type !== 'application/json') {
    const blob = new Blob([data])
    saveAs(blob, fileName)
  } else {
    Vue.prototype.$$Toast.error('下载失败');
  }
}

// 设置根大小
const $$setHtmlRemSize = ({psdWidth = 375, jzPx = 100}) => {//设计稿宽度,基准值
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  let mDocEl = document.documentElement;

  // mDocEl.style.visibility = 'hidden';
  let setRem = function () {
    mDocEl.style.fontSize = Math.ceil(jzPx * (mDocEl.getBoundingClientRect().width / psdWidth)) + 'px';
    mDocEl.style.visibility = 'visible';
  };

  if (document.addEventListener) {
    window.addEventListener(resizeEvt, setRem, false);
    document.addEventListener('DOMContentLoaded', setRem, false);
  }
};

//公共定时器句柄列表
const $$public_setTimeout_handler = [];

//判断是否为ie
const $$isIE = () => {
  let UA = window.navigator.userAgent.toLowerCase();
  return (UA.match(/mozilla/) !== null && (("ActiveXObject" in window)) || UA.match(/msie/) !== null);
};

//获取鼠标手指event
const $$getEvent = e => {
  if (e.type.indexOf("touch") >= 0) return e.touches[0] || e.changedTouches[0];
  return e;
};

//游览器参数
const $$requestParams = (u => {
  let url = u || window.location.search, params = {}, strs;
  //如果url中没有传参 获取window.location.hash中的
  if (url.indexOf('?') === -1) {
    url = window.location.hash.split("?")[1];
    if (url) {
      strs = url.split("&");
      for (let i = 0; i < strs.length; i++) params[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      return params;
    }
    return {}
  }
  if (url.indexOf("?") !== -1) {
    strs = url.substr(1).split("&");
    for (let i = 0; i < strs.length; i++) params[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
  }
  return params;
})(window.location.search);

//监听器
const $$addEvent = (el, eventName, listener, useCapture = false) => {
  if (el.addEventListener) {
    el.addEventListener(eventName, listener, useCapture);
  } else if (el.attachEvent) {
    el.attachEvent('on' + eventName, listener);
  } else {
    el['on' + eventName] = listener;
  }
};

//移除监听器
const $$removeEvent = (el, eventName, listener, useCapture = false) => {
  if (el.removeEventListener) {
    el.removeEventListener(eventName, listener, useCapture);
  } else if (el.detachEvent) {
    el.detachEvent('on' + eventName, listener);
  } else {
    el['on' + eventName] = null;
  }
};

//绑定click事件 只允许 按下和弹起 为同一坐标时才允许触发click
const $$addClickEvent = (el, listener, useCapture = false) => {
  let mousedownX = 0, mousedownY = 0;
  const mouseupHandler = e => {
    $$removeEvent(el, 'mouseup', listener, useCapture);
    (mousedownX === e.clientX && mousedownY === e.clientY) && listener && listener();
  };
  const mousedownHandler = e => {
    mousedownX = e.clientX;
    mousedownY = e.clientY;
    $$addEvent(el, 'mouseup', mouseupHandler, useCapture);
  };
  $$addEvent(el, 'mousedown', mousedownHandler, useCapture);
  return () => {//用于取消监听用
    $$removeEvent(el, 'mousedown', mousedownHandler, useCapture);
  };
};

//触发监听器
const $$dispatchEvent = (el, eventName, params) => {
  if (el.dispatchEvent) {
    let evt = document.createEvent("HTMLEvents");
    evt.emitParams = params;
    evt.initEvent(eventName, false, false);
    el.dispatchEvent(evt, !0, !0);
  } else if (el.fireEvent) {
    let evt = document.createEventObject();
    el.fireEvent('on' + eventName, evt);
  }
};

//深合并
const $$deepmerge = o => {
  return deepmerge($$getVariableType(o) === '[object Array]' ? [] : {}, o, {
    arrayMerge: (a, b) => {
      return b.map(f => ['[object Array]', '[object Object]'].includes($$getVariableType(f)) ? $$deepmerge(f) : f)
    }
  });
};

//元素属性变化 ，el=原生dom，callBack=回调函数
const $$elementResizeObserver = (el, callBack, ...args) => {
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      callBack && callBack(entry.contentRect, ...args);
    }
  });
  ro.observe(el);
  return ro;
};

//注销变化监听 ro=ResizeObserver实例 ，el=原生dom
const $$elementResizeUnobserve = (ro, el) => {
  ro && ro.unobserve(el);
};

//获取元素计算后属性值
const $$getComputedStyle = (dom, style, margin) => {
  if (!style) return getComputedStyle(dom, null);
  let value = parseFloat(getComputedStyle(dom, null)[style].replace('px', ''));
  if ($$isIE() && (style === 'height' || style === 'width')) {
    value = value + (style === 'height' ? (parseFloat(getComputedStyle(dom, null)['paddingTop'].replace('px', '')) + parseFloat(getComputedStyle(dom, null)['paddingBottom'].replace('px', ''))) : 0);
    value = value + (style === 'width' ? (parseFloat(getComputedStyle(dom, null)['paddingRight'].replace('px', '')) + parseFloat(getComputedStyle(dom, null)['paddingLeft'].replace('px', ''))) : 0);
  }
  //是否需要加上margin
  if (margin) {
    value = value + (style === 'height' ? (parseFloat(getComputedStyle(dom, null)['marginTop'].replace('px', '')) + parseFloat(getComputedStyle(dom, null)['marginBottom'].replace('px', ''))) : 0);
    value = value + (style === 'width' ? (parseFloat(getComputedStyle(dom, null)['marginRight'].replace('px', '')) + parseFloat(getComputedStyle(dom, null)['marginLeft'].replace('px', ''))) : 0);
  }
  return value;
};

//脱敏器$$desensitizator.xxxx
const $$desensitizator = {
  common: str => {// 通用 前三后四
    if (!str || str.length < 7) return str;
    return str.substr(0, 3) + '*'.repeat((str.length - 7) || 4) + str.substr(-4);
  }, idCard: str => {// 身份证后四
    if (!str || str.length < 7) return str;
    return '*'.repeat(str.length - 4) + str.substr(-4);
  }, email: email => {// 邮箱数据脱敏
    if (!email) return email;
    let split = email.split('@');
    return split[0].substr(0, 2) + '*'.repeat(split[0].length - 2) + '@' + split[1]
  }, name: name => {//姓名
    if (!name || name.length < 2) return name;
    return '*'.repeat(name.length - 1) + name.substr(-1);
  },
};

//文本验证器
const $$validator = {
  required: value => {
    if ($$getVariableType(value) === '[object Array]') return !!value.length;
    return $$getVariableType(value) === '[object String]' ? !!value.trim() : !$$isEmpty(value)
  },
  isVariable: value => $$isEmpty(value) || /^[A-Za-z_$][A-Za-z0-9_$\.]*$/.test(value),//变量名
  hasChineseCharacters: value => $$isEmpty(value) || /[\u4E00-\u9FA5]+/g.test(value),
  isNumber: value => $$isEmpty(value) || !!Number(value),
  isUserName: value => $$isEmpty(value) || /^[a-zA-Z0-9_-]{4,16}$/.test(value),
  isMorIp: value => /^(?:(?:^|,)((((?:|!)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]))(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]))(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]))(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]|\*|((?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\/(?:[1-9]|[1-2]\d?|3[0-2])|(\-(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])))))))|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)))+$/.test(value),
  isMob: number => /^(\(\d{7,8}\)|\d{3,4}-|\s)?\d{7,8}$/.test(number),//固话校验
  isMobile: mobile => $$isEmpty(mobile) || /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(mobile),
  isMobileOrisMob: phone => /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(phone) || /^(\(\d{7,8}\)|\d{3,4}-|\s)?\d{7,8}$/.test(phone),
  isEmail: email => $$isEmpty(email) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email),
  isIP: ip => $$isEmpty(ip) || /^(((((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(\d|[1-2]\d|3[0-2]))?)|(([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(:((:[\da-fA-F]{1,4}){1,6}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|([\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){6}:(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?))[\n])*((((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(\d|[1-2]\d|3[0-2]))?)|(([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(:((:[\da-fA-F]{1,4}){1,6}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|([\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?)|(([\da-fA-F]{1,4}:){6}:(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?))$/.test(ip),
  isURL: url => $$isEmpty(url) || /^((http|https|ftp)\:\/\/)([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&%\$\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.[a-zA-Z]{2,4})(\:[0-9]+)?(\/[^/][a-zA-Z0-9\.\,\?\'\\/\+&%\$#\=~_\-@]*)*$/.test(url),
  isDomain: url => $$isEmpty(url) || /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(url),
  isLongitude: lon => $$isEmpty(lon) || /^[\-\+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/.test(lon),//经度 -180.00000~180.00000 5位小数
  isLatitude: lat => $$isEmpty(lat) || /^[\-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/.test(lat),//纬度-90.000000~90.00000 5位小数
  isJson: value => {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false
    }
  },
  isIdentityCard: idcode => {//身份证
    console.log('isIdentityCard', idcode)
    if ($$isEmpty(idcode)) return true;
    idcode = idcode.toUpperCase();
    console.log('isIdentityCard--', idcode)
    // 加权因子
    let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    let check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    let code = idcode + "", last = idcode[17];

    let seventeen = code.substring(0, 17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    let arr = seventeen.split(""), len = arr.length, num = 0;
    for (let i = 0; i < len; i++) num = num + arr[i] * weight_factor[i];

    // 获取余数
    let resisue = num % 11;
    let last_no = check_code[resisue];
    // 格式的正则
    // 正则思路
    /*3 10115 2020 0226 0876
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    let idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0-9]{2})([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    let format = idcard_patter.test(idcode);
    console.log('isIdentityCard2', idcode, format, last_no, last)
    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format;
  }, //非法字符注入
  isAntiSqlValid: val => $$isEmpty(val) || /^(select|update|delete|exec|count)/i.test(val), //密码校验 密码为8到16位数字、小写字母、大写字母、特殊符号4类中的3类组合:
  isPwd: pwd => $$isEmpty(pwd) || /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,16}$/.test(pwd), //不能含有键盘连续字符
  isKeyBoardContinuousChar: str => {
    if ($$isEmpty(str)) return true;
    let c1 = [['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'], ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"'], ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?']];
    let c2 = [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='], ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''], ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']];
    str = str.split("");
    //获取坐标位置
    let y = [];
    let x = [];
    for (let c = 0; c < str.length; c++) {
      y[c] = 0;//当做~`键处理
      x[c] = -1;
      for (let i = 0; i < c1.length; i++) {
        for (let j = 0; j < c1[i].length; j++) {
          if (str[c] == c1[i][j]) {
            y[c] = i;
            x[c] = j;
          }
        }
      }
      if (x[c] != -1) continue;
      for (let i = 0; i < c2.length; i++) {
        for (let j = 0; j < c2[i].length; j++) {
          if (str[c] == c2[i][j]) {
            y[c] = i;
            x[c] = j;
          }
        }
      }
    }
    //匹配坐标连线
    for (let c = 1; c < str.length - 1; c++) {
      if (y[c - 1] == y[c] && y[c] == y[c + 1]) {
        if ((x[c - 1] + 1 == x[c] && x[c] + 1 == x[c + 1]) || (x[c + 1] + 1 == x[c] && x[c] + 1 == x[c - 1])) {
          return true;
        }
      } else if (x[c - 1] == x[c] && x[c] == x[c + 1]) {
        if ((y[c - 1] + 1 == y[c] && y[c] + 1 == y[c + 1]) || (y[c + 1] + 1 == y[c] && y[c] + 1 == y[c - 1])) {
          return true;
        }
      }
    }
    return false;
  }, //etc...
};

//表单验证 fields-必填-字段列表 rules-必填-规则列表 fieldName-可选-单独验证fieldName这个字段 errorStatus-当fieldName时为必填，否则不填-页面验证状态
const $$validate = (fields, rules, fieldName, errorStatus) => {
  if (fieldName) {//单独验证
    errorStatus[fieldName] = '';//清空状态
    let value = fields[fieldName];
    if (!rules[fieldName]) return;
    for (let rule of rules[fieldName]) {
      if (rule && $$validator[rule['ruleName']] && !$$validator[rule.ruleName](value)) {
        errorStatus[fieldName] = rule.message;//写入错误状态
        break;
      }
    }
    return;
  }
  return new Promise((resolve, reject) => {
    let errorMessages = {};
    for (let field in fields) {
      if (!fields.hasOwnProperty(field)) continue;
      let value = fields[field];
      if (!rules[field]) continue;
      for (let rule of rules[field]) {
        console.log('$$validate', field, value, rule)
        if (rule && $$validator[rule['ruleName']] && !$$validator[rule['ruleName']](value)) {
          errorMessages[field] = rule.message;
          break;
        }
      }
    }
    Object.keys(errorMessages).length > 0 ? reject(errorMessages) : resolve();
  });
};

//表单清空 fields字段集合 ，filterKeys=需要重置的字段 如果为空则为全部 excludeKey忽略的key  parentRoutes=递归父级路径  a.b.c  defaultObject重置默认值 {'a':1,'c.b.f':6}
const $$resetFormFields = ({fields, filterKeys = [], excludeKeys = [], parentRoutes = '', defaultObject = {}}) => {
  if (!fields) return;
  Object.keys(fields).forEach(key => {
    const parentRouteKey = parentRoutes ? `${parentRoutes}.${key}` : key;
    if (excludeKeys.includes(parentRouteKey)) return;//忽略
    if (filterKeys?.length > 0 && !filterKeys.includes(parentRouteKey)) return;//如果有重置字段 则只重置需要重置的字段
    if (Object.prototype.toString.call(fields[key]) === '[object Object]') return $$resetFormFields({fields: fields[key], filterKeys, excludeKeys, parentRouteKey, defaultObject});
    if (Object.prototype.toString.call(fields[key]) === '[object Array]') return fields[key] = defaultObject[parentRouteKey] || [];
    if (Object.prototype.toString.call(fields[key]) === '[object Boolean]') return fields[key] = defaultObject[parentRouteKey] || false;
    if (Object.prototype.toString.call(fields[key]) === '[object String]') return fields[key] = defaultObject[parentRouteKey] || null;
    fields[key] = defaultObject[parentRouteKey] || null;
  });
};

// //封装多级数据 填写时 {a：{b：{c:xxx}}} 转换成 {a.b.c:xxx}
const $$object2pathObject = (object, parentKey = '') => {
  const pathObject = Object.keys(object).reduce((t, key) => {
    if ($$getVariableType(object[key]) === '[object Object]') return Object.assign(t, $$object2pathObject(object[key], parentKey ? `${parentKey}.${key}` : key));
    return (t[parentKey ? `${parentKey}.${key}` : key] = object[key], t);
  }, {});
  return pathObject;
};

//格式化elementui datetimerange时间范围组件 props = ['beginTime', 'endTime']  如果props未定义 则直接返回数组
const $$formatELDateTimeRange = (timeRange = [], props) => {
  if (!timeRange) timeRange = [];
  let res = props ? {[props[0]]: '', [props[1]]: ''} : [];
  if (timeRange[0] && timeRange[1] && dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss') === dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss') && dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss').indexOf('00:00:00') > -1 && dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss').indexOf('00:00:00') > -1) {
    if (timeRange[0]) res[props ? props[0] : 0] = dayjs(timeRange[0]).format('YYYY-MM-DD 00:00:00');
    if (timeRange[1]) res[props ? props[1] : 1] = dayjs(timeRange[1]).format('YYYY-MM-DD 23:59:59');
    return res;
  }
  if (timeRange[0]) res[props ? props[0] : 0] = dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss');
  if (timeRange[1]) {
    if (dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss').indexOf('00:00:00') > -1) {
      res[props ? props[1] : 1] = dayjs(timeRange[1]).format('YYYY-MM-DD 23:59:59');
    } else {
      res[props ? props[1] : 1] = dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss');
    }
  }
  return res;
};

//加密
const $$ec = params => {
  if (!params) throw new Error('ec params undefined');
  let r = [], s = encodeURIComponent(JSON.stringify(params)).split('');
  for (let i in s) {
    if (!s.hasOwnProperty(i)) continue;
    let index = $$ENCRYPT_CODES.indexOf(s[i]);
    r.push(index < 10 ? '0' + index : index);
  }
  return r.join('');
};

//解密
const $$dc = params => {
  if (!params) throw new Error('dc params undefined');
  let ut = [], u;
  u = params.replace(/(?=(\d{2})+(?!\d))/g, '|').split('|');
  for (let i in u) u.hasOwnProperty(i) && i > 0 && ut.push($$ENCRYPT_CODES[Number(u[i])]);
  try {
    return JSON.parse(decodeURIComponent(ut.join('')));
  } catch (e) {
    console.error('USER_INFO DECRYPT ERROR!');
    return null;
  }
};

//获取毫秒时间
const $$getTime = () => '000' + new Date().getTime();

//获取md5
const $$getMD5 = str => cryptoJs.MD5($$getVariableType(str) === '[object Object]' ? JSON.stringify(str) : str).toString();

//rsa
const encryptor = new JSEncrypt();
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFBqVD2e1bsRVz+tl/iGcJwct+2cwnDL40Xeo6OUP3tFJkYhAmLi/OCUQkvnkhBbz+85f12ygljTyCHeLYVrQAUG2Us0NwBsslMWfA/a4MZExYdcUz/jtRHZTmwLO5VTO8+huq2Dm2PFjW7N4+XRGgm+jV5mtBmgkEkDXUv3a4fQIDAQAB'
const privateKey = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIUGpUPZ7VuxFXP62X+IZwnBy37ZzCcMvjRd6jo5Q/e0UmRiECYuL84JRCS+eSEFvP7zl/XbKCWNPIId4thWtABQbZSzQ3AGyyUxZ8D9rgxkTFh1xTP+O1EdlObAs7lVM7z6G6rYObY8WNbs3j5dEaCb6NXma0GaCQSQNdS/drh9AgMBAAECgYAeh+9vWrmk9UhAtb6sjCBl92Ieq5s1DTIsb6+eDF2ioPLWEkG1mZ0kMzE+I69GWnxNoZfreBDHSZqtHHHfiErIgPcUeH220L++CVXm9guZuN6UVpN7Q5kOQX1YcoJYbvTluSm+RQD9L7cY3/fMVwCMfuVOIoWVCdgEFJ93gQ4FywJBALnYYempeFA0bl6jNLMW2e2VW2FcV2UYNH5bNtA1ZEjZnnlfdX4T5uPpPEwio+NhF1g9q8beE4aRXW+P5mrfcZcCQQC3PfCqTJ3vgn1y8Khf47rIVefG7llXg0IFj/Xozd2d4X1k/myaHIOWfAkIYzuGyb4CSpHEVNO+8n4xbb0Z1sELAkB4IgPJA5+eWQYvbtiWG+NrzOxxFzv3QZpNQ7E/DgRxgxsJ4kcU5NCP6yjrHklKpmxswhDUUKHWjwkTILYVx7KpAkArLFPUvAKGGNeXyi3RkeVDKEJYs3WnUcyvZNDKjh6GAUe7ENrjoI48WXMDX+X5hvTWs10OxfGxzo5+9N0WBmwrAkB57ou1rdIXNdwRdBeU3jSBI1SBZ7aUeWeb6fIEszxdhfM2yxC4vfe8UzRdu+XTf/4YWk8ppcb/EXRovmk3d1jJ'

// 加密
const $$encrypt = str => {
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(str);
}

// 解密
const $$decrypt = str => {
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(str);
}

//字符串->16进制
const $$toHex = str => str.split('').map(s => s.charCodeAt(0).toString(16)).join('');

//OBJECT 转 FormData
const $$toFormData = args => {
  let formData = new FormData();
  Object.keys(args).forEach(k => {
    if ($$getVariableType(args[k]) === '[object Object]') return formData.append(k, JSON.stringify(args[k]));
    if ($$getVariableType(args[k]) === '[object Array]') return args[k].forEach((v, i) => formData.append(k, v));
    formData.append(k, args[k]);
  });
  return formData;
};

//获取UUID随机码
const $$getUUID = (noLine = !0) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i, r;
  if (!noLine) uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4';
  for (i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | Math.random() * 16;
      uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid.join('');
};

//localStorage 3件套
const $$getLocalStorage = (key, type = 'string') => {
  let value = localStorage.getItem(key);
  if (!value) return null;
  if (type.toLowerCase() === 'string') return value;
  if (type.toLowerCase() === 'json') return JSON.parse(value);
};

const $$setLocalStorage = (key, value, type = 'string') => {
  if (type.toLowerCase() === 'string') localStorage.setItem(key, value);
  if (type.toLowerCase() === 'json') localStorage.setItem(key, JSON.stringify(value));
};

const $$removeLocalStorage = key => {
  localStorage.removeItem(key);
};

//sessionStorage 3件套
const $$getSessionStorage = (key, type = 'string') => {
  let value = sessionStorage.getItem(key);
  if (!value) return null;
  if (type.toLowerCase() === 'string') return value;
  if (type.toLowerCase() === 'json') return JSON.parse(value);
};

const $$setSessionStorage = (key, value, type = 'string') => {
  if (type.toLowerCase() === 'string') sessionStorage.setItem(key, value);
  if (type.toLowerCase() === 'json') sessionStorage.setItem(key, JSON.stringify(value));
};

const $$removeSessionStorage = key => {
  sessionStorage.removeItem(key);
};

//统一跳转 to跳转地址, query参数 OBJECT {a:0,b:1} 会转换成 a=0&b=1  linkType跳转类型 默认local local同一项目 | project不同项目之间 newWindow是否打开新窗口
const $$goLink = ({to, query, params, replace = !1, linkType = 'local', newWindow = !1}) => {
  if (/(^http:\/\/|^https:\/\/|^\/\/)/.test(to)) {
    if (newWindow) return window.open($$getQueryifyUrl(to, query));
    location.href = $$getQueryifyUrl(to, query);
  }
  if (linkType === 'local') {
    if (newWindow) return window.open(Vue.prototype.$$router.resolve({...to, query, params}).href, '_blank');
    if (replace) return Vue.prototype.$$router.replace({...to, query, params});
    return Vue.prototype.$$router.push({...to, query, params});
  }
  let url = `${$$getQueryifyUrl(to, query)}`;
  if (newWindow) return window.open(url);
  if (replace) return location.replace(url);
  location.href = url;
};

//根据状态 决定是否新窗口Window组件打开 to跳转路径，compName组件名，$router=路由实例this.$router
const $$redirect = ({to, compName, query, replace = !1, newWindow}) => {
  if (!compName) return $$goLink({to, query, replace, newWindow});//如果没有组件名 这直接跳转
  $$goLink({to, query, params: {compName}, replace, newWindow: Vue.prototype.$$store.getters['portal/getRouteType']});
};

//对url和参数进行处理自动拼接?&  url='',query={} ,encode是否url编码
const $$getQueryifyUrl = (url, query = {}, encode = !0) => {
  if (!query) return url;
  let symbol = ~url.indexOf('?') ? '&' : '?';
  if (Object.keys(query).length <= 0) return url;
  return `${url}${symbol}${qs.stringify(query, {encode})}`
};

// 问候语
const $$greetings = () => {
  return {
    '00': '凌晨好', '01': '凌晨好', '02': '凌晨好', '03': '凌晨好', '04': '凌晨好', '05': '凌晨好', '06': '早上好', '07': '早上好', '08': '上午好', '09': '上午好', '10': '上午好', '11': '上午好', '12': '中午好', '13': '下午好', '14': '下午好', '15': '下午好', '16': '下午好', '17': '下午好', '18': '傍晚好', '19': '傍晚好', '20': '晚上好', '21': '晚上好', '22': '晚上好', '23': '晚上好'
  }[new Date().Format('hh')];
};

//区字典
const $$areaCodeList = (key = 'areaId') => {
  const dict = [{'name': '浦东新区', 'areaId': '310115', 'areaCode': 'SH00PD', nickName: '浦东'}, {'name': '黄浦区', 'areaId': '310101', 'areaCode': 'SH00HP', nickName: '黄浦'}, {'name': '静安区', 'areaId': '310106', 'areaCode': 'SH00JA', nickName: '静安'}, {'name': '徐汇区', 'areaId': '310104', 'areaCode': 'SH00XH', nickName: '徐汇'}, {'name': '长宁区', 'areaId': '310105', 'areaCode': 'SH00CN', nickName: '长宁'}, {'name': '普陀区', 'areaId': '310107', 'areaCode': 'SH00PT', nickName: '普陀'}, {'name': '虹口区', 'areaId': '310109', 'areaCode': 'SH00HK', nickName: '虹口'}, {'name': '杨浦区', 'areaId': '310110', 'areaCode': 'SH00YP', nickName: '杨浦'}, {'name': '宝山区', 'areaId': '310113', 'areaCode': 'SH00BS', nickName: '宝山'}, {'name': '闵行区', 'areaId': '310112', 'areaCode': 'SH00MH', nickName: '闵行'}, {'name': '嘉定区', 'areaId': '310114', 'areaCode': 'SH00JD', nickName: '嘉定'}, {'name': '金山区', 'areaId': '310116', 'areaCode': 'SH00JS', nickName: '金山'}, {
    'name': '松江区', 'areaId': '310117', 'areaCode': 'SH00SJ', nickName: '松江'
  }, {'name': '青浦区', 'areaId': '310118', 'areaCode': 'SH00QP', nickName: '青浦'}, {'name': '奉贤区', 'areaId': '310120', 'areaCode': 'SH00FX', nickName: '奉贤'}, {'name': '崇明区', 'areaId': '310151', 'areaCode': 'SH00CM', nickName: '崇明'}];
  return dict.map(d => ({name: d.name, value: d[key]}));
};

//上万数据转换 10000 to 1w  value=数字 dValue=位数 unit=单位 toFixedLength=小数点位数 force=强制转换
const $$parseWan = ({value, dValue = 10000, unit = '万', forced = !1, toFixedLength = 1}) => {
  if (forced || value >= dValue) {
    let v = Number((value / dValue).toFixed(toFixedLength));
    return {value: v, unit, str: `${v}${unit}`};
  }
  return {value, unit: '', str: `${value}`}
};

//表格数据中空字段默认显示某字符
const $$tableDataFormatter = (row, column, v, index) => {
  if (!column.label) return '';
  if (v === 0 || $$getVariableType(v) === '[object Boolean]') return v;
  return v || '-';
};

//数据中空字段默认显示某字符
const $$defaultDataFormatter = v => {
  if (v === 0 || $$getVariableType(v) === '[object Boolean]') return v;
  if ($$getVariableType(v) === '[object Array]') return v.length ? v : '-';
  return v || '-';
};

//单位转换
const $$parseFlow = ({value, values, currUnit, toUnit, step = 1024, toFixedLength = 2, flowUnits = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB']}) => {
  currUnit = currUnit.toUpperCase();
  toUnit = toUnit ? toUnit.toUpperCase() : $$getSuggestFlowUnit({values, currUnit, step, flowUnits});
  let currUnitIndex = flowUnits.findIndex(u => u === currUnit), toUnitIndex = flowUnits.findIndex(u => u === toUnit);
  if (!~currUnitIndex || !~toUnitIndex || currUnitIndex === toUnitIndex) return {value, unit: currUnit};
  if (currUnitIndex > toUnitIndex) return {value: (value * (step ** (currUnitIndex - toUnitIndex))), unit: toUnit};
  let n = value / (step ** (toUnitIndex - currUnitIndex));
  return {value: (toFixedLength !== -1 ? Number(n.toFixed(toFixedLength)) : n), unit: toUnit};
};

//获取推荐的转换单位 values=[]
const $$getSuggestFlowUnit = ({values, currUnit, step = 1024, flowUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB']}) => {
  currUnit = currUnit.toUpperCase();
  return flowUnits[flowUnits.findIndex(u => u === currUnit) + Math.ceil((parseInt(Math.max(...values)).toString().length - 1) / (step.toString().length - 1)) - 1];
};

//获取最短转换单位 values=[]  524288B -> 512KB  524288KB->512MB
const $$getShortFlowUnit = ({value, currUnit, flowUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB']}) => {
  currUnit = currUnit.toUpperCase();
  if (!value || value < 1024) return `${value || 0}${currUnit}`;
  let len = 1;
  while ((value /= 1024) >= 1024) len++;
  return `${value.toFixed(0)}${flowUnits[len]}`;
};

//格式化省市 去掉省市自治区
const $$parseProvince = province => province.replace(/(维吾尔自治区|壮族自治区|回族自治区|自治区|特别行政区|省|市)$/g, '');

//月天数
const $$getDayCountOfMonth = (year, month) => {
  if (month.toString().startsWith('0')) month = month.toString().slice(1);
  return [0, 31, ((year % 100 === 0 && year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

//星期
const $$getWeekDay = time => {
  return ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][dayjs(time).day()];
};

//获取变量类型
const $$getVariableType = v => Object.prototype.toString.call(v);

//转换参数 将单个对象中 key 带.的 转换为对象    例：{a.b:2}  =>  {a:{b:2}}
const $$convert2Object = o => {
  return Object.keys(o).reduce((t, c, i) => {
    if (c.indexOf('.') >= 0) {
      const sp = c.split('.');
      if (!t[sp[0]]) t[sp[0]] = {};
      t[sp[0]][sp[1]] = o[c];
      return t;
    }
    return (t[c] = o[c], t);
  }, {});
};

//获取事件当前元素
const $$getEventElement = e => {
  return e.srcElement || e.target;
};

// base642FileSuffix name
const $$base642File = (base64, mime = 'image/png', suffixName = 'png') => {
  const bytes = atob(base64.split(',')[1]);
  const u8a = new Uint8Array(new ArrayBuffer(bytes.length));
  for (let i = 0; i < bytes.length; i++) u8a[i] = bytes.charCodeAt(i);
  return new File([new Blob([u8a], {type: mime})], `file-${(+new Date())}.${suffixName}`, {type: mime});
};

//file2Base64
const $$file2Base64 = file => new Promise((resolve, reject) => {
  console.log('$$file2Base64', file);
  const reader = new FileReader();
  reader.onload = e => {
    console.log(e);
    resolve(e.target.result);
  }
  reader.onerror = () => resolve();
  reader.readAsDataURL(file);
});

//blob2Base64
const $$blob2Base64 = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = e => {
    console.log(e);
    resolve(e.target.result);
  }
  reader.onerror = () => resolve();
  reader.readAsDataURL(blob);
});

//字符串转blob
const $$str2Blob = (str, mime) => {
  // let n = str.length, u8arr = new Uint8Array(str.length);
  // while (n--) u8arr[n] = str.charCodeAt(n);
  return new Blob(['\ufeff', str], {type: mime});
};

const $$stream2BlobUrl = (stream, mime) => {
  let blob = new Blob([stream], {type: `${mime}`});
  return URL.createObjectURL(blob);
};

const $$blob2stream = blob => new Promise((resolve, reject) => {
  console.log('$$blob2stream', blob);
  const reader = new FileReader();
  reader.onload = e => {
    console.log(e);
    resolve(e.target.result);
  }
  reader.onerror = () => resolve();
  reader.readAsArrayBuffer(blob);
});

// 文件下载
const $$downloadFile = (fileLink, fileName) => {
  console.log('$$downloadFile', fileLink, fileName)
  let a = document.createElement('a');
  const id = $$getUUID();
  a.target = '_blank';
  a.id = id;
  a.href = fileLink;
  a.download = fileName;
  document.body.append(a);
  a.click();
  window.URL.revokeObjectURL(fileLink);
  document.getElementById(id).remove();
};

// json转文件后下载
const $$jsonToFileUrl = (str, fileName = '文件.json') => {
  const blobVal = new Blob([JSON.stringify(str)], {type: 'text/plain'})
  let fileUrl = URL.createObjectURL(blobVal)
  let aDom = document.createElement('a');
  aDom.setAttribute('href', fileUrl);
  aDom.setAttribute('download', fileName);
  aDom.click();
  URL.revokeObjectURL(fileUrl);
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
const $$handleTree = (data, id, parentId, children) => {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  return tree;
}

// 字符串转文件后下载
const $$textToFileUrl = (str, fileName = '字符串文件.txt') => {
  const blobVal = new Blob([str], {type: 'text/plain'})
  let fileUrl = URL.createObjectURL(blobVal)
  let aDom = document.createElement('a');
  aDom.setAttribute('href', fileUrl);
  aDom.setAttribute('download', fileName);
  aDom.click();
  URL.revokeObjectURL(fileUrl);
};

// 判断是否是空
const $$isEmpty = value => {
  if ($$getVariableType(value) === '[object Number]') return false;
  if ($$getVariableType(value) === '[object Boolean]') return false;
  return !value;
};

//获取页面缩放比例 最小一个
const $$getPageScale = ({width = 1920, height = 1080, type = 'min'}) => {
  const sw = $$getComputedStyle(document.body, 'width') / width;
  const sh = $$getComputedStyle(document.body, 'height') / height;
  return Math[type](sw, sh);
};

//阻止缩放
const $$stopScale = () => {
  const keyCodeMap = {
    91: true, // command
    61: true, 107: true, // 数字键盘 +
    109: true, // 数字键盘 -
    173: true, // 火狐 - 号
    187: true, // +
    189: true, // -
  };
  // 覆盖ctrl||command + ‘+’/‘-’
  document.onkeydown = function (event) {
    const e = event || window.event;
    const ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && keyCodeMap[e.keyCode]) {
      e.preventDefault();
    } else if (e.detail) { // Firefox
      event.returnValue = false;
    }
  };
  // 覆盖鼠标滑动
  document.body.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      if (e.deltaY < 0) {
        e.preventDefault();
        return false;
      }
      if (e.deltaY > 0) {
        e.preventDefault();
        return false;
      }
    }
  }, {passive: false});
};

//滚动parent 将child滚到可视区域
const $$scrollParentToChild = (parent, child) => {
  // Where is the parent on page
  let parentRect = parent.getBoundingClientRect();
  // What can you see?
  let parentViewableArea = {
    height: parent.clientHeight, width: parent.clientWidth
  };

  // Where is the child
  let childRect = child.getBoundingClientRect();
  // Is the child viewable?
  let isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

  // if you can't see the child try to scroll parent
  // if (!isViewable) {
  // scroll by offset relative to parent
  // parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
  parent.scrollTo({top: (childRect.top + parent.scrollTop) - parentRect.top, behavior: 'smooth'})
  // }
};

//获取svg贝赛尔曲线的path
const $$getSvgCurvPath = (p1, p2, curv = 8) => {
  let k2 = -(p2.x - p1.x) / (p2.y - p1.y), controX = 0, controY = 0;
  if (k2 < 2 && k2 > -2) {
    controX = (p2.x + p1.x) / 2 + curv;
    controX = controX < 0 ? -controX : controX;
    controY = k2 * (controX - (p1.x + p2.x) / 2) + (p1.y + p2.y) / 2;
    controY = controY < 0 ? -controY : controY;
  } else {
    controY = (p2.y + p1.y) / 2 + curv;
    controY = controY < 0 ? -controY : controY;
    controX = (controY - (p1.y + p2.y) / 2) / k2 + (p1.x + p2.x) / 2;
    controX = controX < 0 ? -controX : controX;
  }
  return `M ${p1.x} ${p1.y} Q ${controX} ${controY} ${p2.x} ${p2.y}`;
}

// 颜色混入透明度 hex|RGBA|RGB
const $$colorMixinOpacity = (color, opacity = 1) => {
  //颜色添加透明度 color支持 #FFF #FFFF #FFFFFF #FFFFFFFF rgb(0,0,0) rgba(0,0,0,0) 6种
  color = color.replace(/ /g, '').toUpperCase();
  const colorType = color.startsWith('#') ? 'hex' : (color.startsWith('RGB') || color.startsWith('RGBA')) ? 'RGB' : null;
  if (!colorType) return color;
  color = color.replace(/#|RGBA|RGB|\(|\)/g, '');
  let colorSplits = colorType === 'hex' ? color.split('') : color.split(',');
  let R, G, B;
  if (colorType === 'hex' && (colorSplits.length === 3 || colorSplits.length === 4)) { //#FFF #FFFF
    R = `${colorSplits[0]}${colorSplits[0]}`;
    G = `${colorSplits[1]}${colorSplits[1]}`;
    B = `${colorSplits[2]}${colorSplits[2]}`;
  } else {//#FFFFFF #FFFFFFFF rgb(0,0,0) rgba(0,0,0,0)
    R = colorType === 'hex' ? `${colorSplits[0]}${colorSplits[1]}` : colorSplits[0];
    G = colorType === 'hex' ? `${colorSplits[2]}${colorSplits[3]}` : colorSplits[1];
    B = colorType === 'hex' ? `${colorSplits[4]}${colorSplits[5]}` : colorSplits[2];
  }
  return colorType === 'hex' ? `rgba(${parseInt(R, 16)},${parseInt(G, 16)},${parseInt(B, 16)},${opacity})` : `rgba(${R},${G},${B},${opacity})`;
};

// 颜色深浅度 hex|RGB
const $$getColorDarkLight = (color) => {
  //颜色添加透明度 color支持 #FFF #FFFF #FFFFFF #FFFFFFFF rgb(0,0,0) rgba(0,0,0,0) 6种
  color = color.replace(/ /g, '').toUpperCase();
  const colorType = color.startsWith('#') ? 'hex' : (color.startsWith('RGB') || color.startsWith('RGBA')) ? 'RGB' : null;
  if (!colorType) return color;
  color = color.replace(/#|RGBA|RGB|\(|\)/g, '');
  let colorSplits = colorType === 'hex' ? color.split('') : color.split(',');
  let R, G, B;
  if (colorType === 'hex' && (colorSplits.length === 3 || colorSplits.length === 4)) { //#FFF #FFFF
    R = parseInt(`${colorSplits[0]}${colorSplits[0]}`, 16);
    G = parseInt(`${colorSplits[1]}${colorSplits[1]}`, 16);
    B = parseInt(`${colorSplits[2]}${colorSplits[2]}`, 16);
  } else {//#FFFFFF #FFFFFFFF rgb(0,0,0) rgba(0,0,0,0)
    R = colorType === 'hex' ? parseInt(`${colorSplits[0]}${colorSplits[1]}`, 16) : colorSplits[0];
    G = colorType === 'hex' ? parseInt(`${colorSplits[2]}${colorSplits[3]}`, 16) : colorSplits[1];
    B = colorType === 'hex' ? parseInt(`${colorSplits[4]}${colorSplits[5]}`, 16) : colorSplits[2];
  }
  // console.log('$$colorDarkLight', color, (R * 0.299 + G * 0.587 + B * 0.114));
  return (R * 0.299 + G * 0.587 + B * 0.114) < 127.5 ? 'dark' : 'light';
};

// 合并多张img为一张
const $$mergeImages = imagesList => {
  Promise.all(imagesList.map(src => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  }))).then(result => {
    console.log(result)
  });
};

// 根据经纬度计算距离 (km)
const $$mathGCJ02Distance = (lat1, lng1, lat2, lng2) => {
  let radLat1 = lat1 * Math.PI / 180.0;
  let radLat2 = lat2 * Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  return Math.round((s * 6378.137) * 10000) / 10;
};

// 图片压缩 file或base64
const $$compressImage = (file, quality = 0.5) => new Promise(async (resolve, reject) => {
  const base64 = $$getVariableType(file) === '[object File]' ? (await $$file2Base64(file)) : file;
  if (!base64) return resolve(null);
  const image = new Image();
  image.onload = async function () {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    const compressBase64 = canvas.toDataURL('image/jpeg', quality);
    resolve($$base642File(compressBase64, 'image/jpeg', 'jpg'));
  }
  image.src = base64;
});

// str2Base64
const $$str2Base64 = str => btoa(encodeURIComponent(str));
//Base642str
const $$base642Str = base64 => encodeURIComponent(atob(base64));

// 截取身份证，出生日期
const $$getIdCardBirth = idCard => `${idCard.substring(6, 10)}-${idCard.substring(10, 12)}-${idCard.substring(12, 14)}`;

// 截取身份证，性别
const $$getIdCardSex = idCard => parseInt(idCard.substr(16, 1)) % 2 === 1 ? '男' : '女';

// 过滤日期格式
const $$filterStrDate = str => {
  if (!str) return '';
  return str.replace(/(年)|(月)|(\.)/g, '/').replace(/(日)/g, '');
}

//base64加解密
const $$Base64Encoder = str => btoa(encodeURIComponent(str));
const $$Base64Decoder = str => decodeURIComponent(atob(str).split('').map(function (c) {
  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

const defaultKey = "defaultKey";
const defaultVi = "defaultVi";

const $$AesEncoder = msg => cryptoJs.enc.Base64.stringify(cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(msg), cryptoJs.enc.Latin1.parse(defaultKey), {iv: cryptoJs.enc.Latin1.parse(defaultVi), mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7,}).ciphertext);

const $$AesDecoder = msg => cryptoJs.AES.decrypt(msg, cryptoJs.enc.Latin1.parse(defaultKey), {iv: cryptoJs.enc.Latin1.parse(defaultVi), mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7,}).toString(cryptoJs.enc.Utf8);

const $$ssbApiGateCrypto = (timestamp, nonce, token) => cryptoJs.SHA256(timestamp + token + nonce + timestamp).toString(cryptoJs.enc.Hex).toUpperCase();

const $$goRouter = async (args, isRedirect) => {
  if (args && (args.name || args.path)) {
    try {
      return Vue.prototype.$$router[isRedirect ? 'replace' : 'push'](args);
    } catch (e) {
      if (e.message.indexOf('No match for') >= 0) return Vue.prototype.$$router.push({path: '/404'});
    }
    return Vue.prototype.$$Dialog({title: '提示', message: '敬请期待'}).then($$emptyFn).catch($$emptyFn);
  }
  Vue.prototype.$$Dialog({title: '提示', message: '敬请期待'}).then($$emptyFn).catch($$emptyFn);
}

// 锁定元素滚动
const $$triggerLockElement = (el = document.body, lockClass = 'element-locked') => {
  const classList = el.classList.value.split(' ');

  if (classList.includes(lockClass)) {
    el.className = classList.filter(c => c !== lockClass).join(' ');
    return window.scrollTo(0, Number(el.getAttribute('top') || 0));
  }
  el.setAttribute('top', window.scrollY.toString() || 0);
  el.className = [...classList, lockClass].join(' ');
}

//获取完整的时间字符串 补全  20XX-XX-XX XX:XX:XX
const $$dateToPad = str => str ? str.replace(/-|:/g, '').padStart(2, '0') : '';
const $$getFullDateStr = (d) => {
  const match = (d || '').match(/((\d{4})(-\d{1,2})?(-\d{1,2})?( )?)?(\d{1,2})?(:\d{1,2})?(:\d{1,2})?/);
  if (!match) return $$dayjs().format('YYYY-MM-DD HH:mm:ss');
  const year = match[2] || '2023', month = $$dateToPad(match[3]) || '-01', day = $$dateToPad(match[4]) || '-01', hour = $$dateToPad(match[6]) || '00', min = $$dateToPad(match[7]) || ':00', sec = $$dateToPad(match[8]) || ':00';
  return `${year}${month}${day} ${hour}${min}${sec}`;
}

//判断是否有权限
const $$hasPermissions = (per = []) => {
  const permissions = Vue.prototype.$$store.getters['user/GET_PERMISSIONS'];
  if (permissions?.[0] === '*:*') return !0;//全权限
  return (per || []).filter(v => permissions.includes(v)).length > 0;
}

//复制文字
const $$toCopy = (event, text) => {
  const clipboard = new Clipboard(event.target, {text: () => `${text}`});
  clipboard.on('success', () => {
    Vue.prototype.$$Toast({message: `复制成功`, type: 'success'});
    clipboard.destroy()
  });
  clipboard.on('error', (e) => {
    Vue.prototype.$$Toast({message: `复制失败`, type: 'error'});
    clipboard.destroy()
  });
  clipboard.onClick(event);
}

//将数组按几个一组分割
const $$splitArray = (arr = [], splitSize = 2) => (arr || []).reduce((t, c, i) => (t[Math.floor(i / splitSize)].push(c), t), [...Array.from({length: Math.ceil(arr.length / splitSize)}).map(() => [])]);

//资源路径
const $$getSourceUrl = path => {
  if (!path) return null;
  if (/(^http:\/\/|^https:\/\/|^\/\/)/.test(path)) return path;
  const split = path?.split('.');//存的时候带上文件后缀 用来区别文件类型 预览时需要去除 xxxx.ext
  // const BASE_URL = ['jpg', 'png', 'jpeg'].includes(split[1]) ? process.env.VUE_APP_RESOURCE_BASE_PIC_URL : process.env.VUE_APP_RESOURCE_BASE_DOC_URL;
  return `${process.env.VUE_APP_RESOURCE_BASE_PIC_URL}${split[0]}`;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
const $$RouYiHandleTree = (data, id, parentId, children) => {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  let childrenListMap = {};
  let nodeIds = {};
  let tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  return tree;
}

// 格式化级联选择器数据
const $$formatCascaderTree = (data = [], labelName = 'label', valueName = 'value', childrenName = 'children') => (data || []).reduce((t, c) => {
  t.push({
    label: c[labelName], value: c[valueName],
    children: c[childrenName]?.length ? $$formatCascaderTree(c[childrenName], labelName, valueName, childrenName) : null
  });
  return t;
}, []);

//寻找树路径
const $$findTreePath = ({tree = [], props = {codeKey: 'code', childrenKey: 'children'}}) => {
  const flats = $$lodash.flatMapDeep(tree, n => {
    console.log('n', n)
  });
}

export default {
  install(Vue, options) {
    //加密串
    Vue.prototype.$$ENCRYPT_CODES = $$ENCRYPT_CODES; //用户信息加密串
    Vue.prototype.$$OS_TYPE = $$OS_TYPE;//系统类型

    //游览器检查 设置事件名称 pc鼠标事件 移动端touch事件
    Vue.prototype.$$MOUSE_EVENT = $$MOUSE_EVENT;

    // Vue.prototype.$$sm4 = $$sm4;
    // 添加时间插件
    Vue.prototype.$$dayjs = $$dayjs;
    Vue.prototype.$$dateFormatter = $$dateFormatter;
    Vue.prototype.$$dateFormatterYMDHMS = $$dateFormatterYMDHMS;
    Vue.prototype.$$dateFormatterYMD = $$dateFormatterYMD;

    Vue.prototype.$$findTreePath = $$findTreePath;

    Vue.prototype.$$lodash = $$lodash;
    Vue.prototype.$$getFullDateStr = $$getFullDateStr;

    Vue.prototype.$$emitter = $$emitter;

    // 延时方法
    Vue.prototype.$$sleep = $$sleep;
    Vue.prototype.$$emptyFn = $$emptyFn;

    // 设置根大小
    Vue.prototype.$$setHtmlRemSize = $$setHtmlRemSize;
    Vue.prototype.$$addDateRange = $$addDateRange;
    Vue.prototype.$$resetForm = $$resetForm;

    //公共定时器句柄列表
    Vue.prototype.$$public_setTimeout_handler = $$public_setTimeout_handler;

    //判断是否为ie
    Vue.prototype.$$isIE = $$isIE;

    //获取鼠标手指event
    Vue.prototype.$$getEvent = $$getEvent;

    //游览器参数
    Vue.prototype.$$requestParams = $$requestParams;

    //监听器
    Vue.prototype.$$addEvent = $$addEvent;

    //移除监听器
    Vue.prototype.$$removeEvent = $$removeEvent;

    //绑定click事件 只允许 按下和弹起 为同一坐标时才允许触发click
    Vue.prototype.$$addClickEvent = $$addClickEvent;

    //触发监听器
    Vue.prototype.$$dispatchEvent = $$dispatchEvent;

    //深合并
    Vue.prototype.$$deepmerge = $$deepmerge;

    //元素属性变化 ，el=原生dom，callBack=回调函数
    Vue.prototype.$$elementResizeObserver = $$elementResizeObserver;

    //注销变化监听 ro=ResizeObserver实例 ，el=原生dom
    Vue.prototype.$$elementResizeUnobserve = $$elementResizeUnobserve;

    //获取元素计算后属性值
    Vue.prototype.$$getComputedStyle = $$getComputedStyle;

    //脱敏器
    Vue.prototype.$$desensitizator = $$desensitizator;

    //文本验证器
    Vue.prototype.$$validator = $$validator;

    //表单验证 fields-必填-字段列表 rules-必填-规则列表 fieldName-可选-单独验证fieldName这个字段 errorStatus-当fieldName时为必填，否则不填-页面验证状态
    Vue.prototype.$$validate = $$validate;

    //表单清空 fields字段集合 ，filterKeys=需要重置的字段 如果为空则为全部 excludeKey忽略的key  parentRoutes=递归父级路径  a.b.c
    Vue.prototype.$$resetFormFields = $$resetFormFields;

    //格式化elementui datetimerange时间范围组件
    Vue.prototype.$$formatELDateTimeRange = $$formatELDateTimeRange;

    //加密
    Vue.prototype.$$ec = $$ec;

    //解密
    Vue.prototype.$$dc = $$dc;

    //获取毫秒时间
    Vue.prototype.$$getTime = $$getTime;

    //获取md5
    Vue.prototype.$$getMD5 = $$getMD5;

    //获取svg贝赛尔曲线的path
    Vue.prototype.$$getSvgCurvPath = $$getSvgCurvPath;

    //字符串->16进制
    Vue.prototype.$$toHex = $$toHex;

    //加解密
    Vue.prototype.$$encrypt = $$encrypt;
    Vue.prototype.$$decrypt = $$decrypt;

    //OBJECT 转 FormData
    Vue.prototype.$$toFormData = $$toFormData;
    Vue.prototype.$$fileSaveAs = $$fileSaveAs;

    //获取UUID随机码
    Vue.prototype.$$getUUID = $$getUUID;

    //localStorage 3件套
    Vue.prototype.$$getLocalStorage = $$getLocalStorage;

    Vue.prototype.$$setLocalStorage = $$setLocalStorage;

    Vue.prototype.$$removeLocalStorage = $$removeLocalStorage;

    //sessionStorage 3件套
    Vue.prototype.$$getSessionStorage = $$getSessionStorage;

    Vue.prototype.$$setSessionStorage = $$setSessionStorage;

    Vue.prototype.$$removeSessionStorage = $$removeSessionStorage;

    //统一跳转 to跳转地址, query参数 OBJECT {a:0,b:1} 会转换成 a=0&b=1  linkType跳转类型 默认local local同一项目 | project不同项目之间 newWindow是否打开新窗口
    Vue.prototype.$$goLink = $$goLink;

    //根据状态 决定是否新窗口Window组件打开 to跳转路径，compName组件名，$router=路由实例this.$router
    Vue.prototype.$$redirect = $$redirect;

    //对url和参数进行处理自动拼接?&  url='',query={} ,encode是否url编码
    Vue.prototype.$$getQueryifyUrl = $$getQueryifyUrl;

    // 问候语
    Vue.prototype.$$greetings = $$greetings;

    //上万数据转换 10000 to 1w  value=数字 dValue=位数 unit=单位 toFixedLength=小数点位数 force=强制转换
    Vue.prototype.$$parseWan = $$parseWan;

    //表格数据中空字段默认显示某字符
    Vue.prototype.$$tableDataFormatter = $$tableDataFormatter;

    //数据中空字段默认显示某字符
    Vue.prototype.$$defaultDataFormatter = $$defaultDataFormatter;

    //单位转换
    Vue.prototype.$$parseFlow = $$parseFlow;

    //获取推荐的转换单位 values=[]
    Vue.prototype.$$getSuggestFlowUnit = $$getSuggestFlowUnit;
    Vue.prototype.$$getShortFlowUnit = $$getShortFlowUnit;

    //格式化省市 去掉省市自治区
    Vue.prototype.$$parseProvince = $$parseProvince;

    //月天数
    Vue.prototype.$$getDayCountOfMonth = $$getDayCountOfMonth;

    //星期
    Vue.prototype.$$getWeekDay = $$getWeekDay;

    //区字典
    Vue.prototype.$$areaCodeList = $$areaCodeList;

    //获取变量类型
    Vue.prototype.$$getVariableType = $$getVariableType;

    //转换参数 将单个对象中 key 带.的 转换为对象    例：{a.b:2}  =>  {a:{b:2}}
    Vue.prototype.$$convert2Object = $$convert2Object;

    //获取事件当前元素
    Vue.prototype.$$getEventElement = $$getEventElement;

    // 文件下载
    Vue.prototype.$$downloadFile = $$downloadFile;

    Vue.prototype.$$stream2BlobUrl = $$stream2BlobUrl;
    Vue.prototype.$$str2Blob = $$str2Blob;
    Vue.prototype.$$blob2Base64 = $$blob2Base64;
    Vue.prototype.$$jsonToFileUrl = $$jsonToFileUrl;
    Vue.prototype.$$handleTree = $$handleTree;
    Vue.prototype.$$textToFileUrl = $$textToFileUrl;

    //base642File
    Vue.prototype.$$base642File = $$base642File;
    Vue.prototype.$$file2Base64 = $$file2Base64;

    //图片压缩
    Vue.prototype.$$compressImage = $$compressImage;

    // 判断是否是空
    Vue.prototype.$$isEmpty = $$isEmpty;

    //阻止缩放
    Vue.prototype.$$stopScale = $$stopScale

    //滚动parent 将child滚到可视区域
    Vue.prototype.$$scrollParentToChild = $$scrollParentToChild;

    // 颜色混入透明度 hex|RGBA|RGB
    Vue.prototype.$$colorMixinOpacity = $$colorMixinOpacity;
    Vue.prototype.$$getColorDarkLight = $$getColorDarkLight;
    Vue.prototype.$$mergeImages = $$mergeImages;

    Vue.prototype.$$getIdCardBirth = $$getIdCardBirth;

    Vue.prototype.$$getIdCardSex = $$getIdCardSex;

    Vue.prototype.$$filterStrDate = $$filterStrDate;

    Vue.prototype.$$AesEncoder = $$AesEncoder;

    Vue.prototype.$$AesDecoder = $$AesDecoder;

    Vue.prototype.$$ssbApiGateCrypto = $$ssbApiGateCrypto;

    // str2Base64
    Vue.prototype.$$str2Base64 = $$str2Base64;
    // Base642str
    Vue.prototype.$$base642Str = $$base642Str;

    //经纬度计算距离
    Vue.prototype.$$mathGCJ02Distance = $$mathGCJ02Distance;

    //base64加解密
    Vue.prototype.$$Base64Encoder = $$Base64Encoder;
    Vue.prototype.$$Base64Decoder = $$Base64Decoder;

    Vue.prototype.$$object2pathObject = $$object2pathObject;

    Vue.prototype.$$goRouter = $$goRouter;

    Vue.prototype.$$triggerLockElement = $$triggerLockElement;
    Vue.prototype.$$hasPermissions = $$hasPermissions;
    Vue.prototype.$$toCopy = $$toCopy;
    Vue.prototype.$$getSourceUrl = $$getSourceUrl;
    Vue.prototype.$$blob2stream = $$blob2stream;
    Vue.prototype.$$splitArray = $$splitArray;
    Vue.prototype.$$getPageScale = $$getPageScale;
    Vue.prototype.$$RouYiHandleTree = $$RouYiHandleTree;
    Vue.prototype.$$tansParams = $$tansParams;
    Vue.prototype.$$formatCascaderTree = $$formatCascaderTree;

  }
};
export {
  $$ENCRYPT_CODES,
  $$OS_TYPE,
  $$MOUSE_EVENT,
  // $$sm4,
  $$dayjs,
  $$dateFormatter,
  $$dateFormatterYMDHMS,
  $$dateFormatterYMD,
  $$emitter,
  $$public_setTimeout_handler,
  $$desensitizator,
  $$validator,
  $$lodash,
  $$getSourceUrl,
  $$sleep,
  $$emptyFn,
  $$str2Base64,
  $$base642Str,
  $$setHtmlRemSize,
  $$addDateRange,
  $$resetForm,
  $$isIE,
  $$getEvent,
  $$requestParams,
  $$addEvent,
  $$removeEvent,
  $$addClickEvent,
  $$dispatchEvent,
  $$deepmerge,
  $$elementResizeObserver,
  $$elementResizeUnobserve,
  $$getComputedStyle,
  $$validate,
  $$resetFormFields,
  $$formatELDateTimeRange,
  $$ec,
  $$dc,
  $$getTime,
  $$getMD5,
  $$toHex,
  $$encrypt,
  $$decrypt,
  $$toFormData,
  $$getUUID,
  $$getLocalStorage,
  $$setLocalStorage,
  $$removeLocalStorage,
  $$getSessionStorage,
  $$setSessionStorage,
  $$removeSessionStorage,
  $$goLink,
  $$redirect,
  $$getQueryifyUrl,
  $$greetings,
  $$parseWan,
  $$tableDataFormatter,
  $$mergeImages,
  $$defaultDataFormatter,
  $$object2pathObject,
  $$parseFlow,
  $$getSuggestFlowUnit,
  $$getShortFlowUnit,
  $$stream2BlobUrl,
  $$parseProvince,
  $$getDayCountOfMonth,
  $$getWeekDay,
  $$areaCodeList,
  $$getVariableType,
  $$convert2Object,
  $$getEventElement,
  $$downloadFile,
  $$jsonToFileUrl,
  $$handleTree,
  $$textToFileUrl,
  $$getSvgCurvPath,
  $$str2Blob,
  $$blob2Base64,
  $$isEmpty,
  $$base642File,
  $$file2Base64,
  $$compressImage,
  $$stopScale,
  $$scrollParentToChild,
  $$colorMixinOpacity,
  $$getColorDarkLight,
  $$getIdCardBirth,
  $$getIdCardSex,
  $$filterStrDate,
  $$AesEncoder,
  $$AesDecoder,
  $$Base64Decoder,
  $$Base64Encoder,
  $$ssbApiGateCrypto,
  $$mathGCJ02Distance,
  $$goRouter,
  $$triggerLockElement,
  $$getFullDateStr,
  $$hasPermissions,
  $$toCopy,
  $$splitArray,
  $$blob2stream,
  $$getPageScale,
  $$RouYiHandleTree,
  $$tansParams,
  $$fileSaveAs,
  $$formatCascaderTree,
  $$findTreePath
};
