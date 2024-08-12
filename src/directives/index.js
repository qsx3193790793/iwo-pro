//自定义指令集
let directives = [];

const context = require.context('./directives', true, /\.js$/);
context.keys().forEach((filename) => {
  directives.push(context(filename).default)
});
console.log('directives', directives)

export default {
  install(Vue, options) {
    directives.forEach(directive => {
      Vue.directive(directive.name, {
        beforeMount: directive.beforeMount,
        mounted: directive.mounted,
        updated: directive.updated,
        beforeUnmount: directive.beforeUnmount
      })
    });
  }
}
