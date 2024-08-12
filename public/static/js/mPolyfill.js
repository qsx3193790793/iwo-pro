//IE9 classList
if (!("classList" in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function () {
      let self = this;

      function update(fn) {
        return function (value) {
          let classes = self.className.split(/\s+/g),
            index = classes.indexOf(value);
          fn(classes, index, value);
          self.className = classes.join(" ");
        }
      }

      return {
        add: update(function (classes, index, value) {
          if (!~index) classes.push(value);
        }),
        remove: update(function (classes, index) {
          if (~index) classes.splice(index, 1);
        }),
        toggle: update(function (classes, index, value) {
          if (~index)
            classes.splice(index, 1);
          else
            classes.push(value);
        }),
        contains: function (value) {
          return !!~self.className.split(/\s+/g).indexOf(value);
        },
        item: function (i) {
          return self.className.split(/\s+/g)[i] || null;
        }
      };
    }
  });
}

//日期原型上添加日期格式化 new Data().Format('yyyy-MM-dd ....') 2020-02-02 ....
Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
