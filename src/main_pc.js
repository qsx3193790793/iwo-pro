import 'babel-polyfill';
import "core-js/stable";
import "regenerator-runtime/runtime";
import "nprogress/nprogress.css";
import 'element-ui/lib/theme-chalk/index.css';
import "./scss/public.scss";
import "./scss/element-ui.scss";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Vue from 'vue';
import utils from './utils';
import api from './api';
import directives from './directives';
import PublicDictLoader from '@/mixin/PublicDictLoader';//通用字典请求mixin
import Element from 'element-ui';

// 分页组件
export default ({App, router, store, scssVariables = {}, pageConfig = {}}) => {

  Vue.prototype.$$router = router;
  Vue.prototype.$$store = store;
  Vue.prototype.$$Loading = () => Element.Loading.service({fullscreen: true, lock: true});
  Vue.prototype.$$ElementLoading = target => Element.Loading.service({target});
  Vue.prototype.$$Dialog = Element.MessageBox;
  Vue.prototype.$$Toast = Element.Message;
  Vue.prototype.$$Toast_msg = args => setTimeout(() => Element.Message(args), 10);

  Vue.prototype.$$scssVariables = scssVariables;
  Vue.prototype.$$pageConfig = pageConfig;

  Vue.component('ELScrollbar', Element.Scrollbar);//引入element-ui滚动条
  Vue.use(Element, {size: 'small', zIndex: 3000});
  // Vue.use(formCreate);
  Vue.use(api);
  Vue.use(directives);
  Vue.use(Element.Loading);
  Vue.use(utils);
  Vue.use(router);
  Vue.use(store);

  Vue.mixin(PublicDictLoader);

  new Vue({
    store,
    router, // 将路由实例注入到Vue根实例中
    mounted() {
      this.$$setHtmlRemSize({psdWidth: 1920});
      this.$$stopScale();
    },
    render: h => h(App)
  }).$mount('#app');
}
