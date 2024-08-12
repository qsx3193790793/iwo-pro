//引入所有请求
let requests = {};
const context = require.context('./requests', true, /\.js$/);
context.keys().forEach((filename) => {
  const apiTag = filename.match(/\.\/(.*)\.js$/)?.[1];
  requests[apiTag] = context(filename).default || {};
});
console.log('requests', requests)
export default {
  install(Vue, options) {
    // 所有请求挂载$api中，this.$$api.xxxx()
    Vue.prototype.$$api = requests;
  }
}
