import Vue from 'vue';
import Router from 'vue-router';
import NProgress from "nprogress";

Vue.use(Router);

const VueRouterPush = Router.prototype.push;
Router.prototype.push = function (to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

NProgress.configure({showSpinner: false});

export default ({customRoutes, routeContext, beforeEach, afterEach}) => {
  let routes = [];
  let routesTemp = [];
  let recursion = (children, parent) => {//递归插入嵌套路由
    routesTemp.forEach(o => {
      o.parents === parent && (children.push(o), recursion(o.children, `${parent}/${o.name}`));
    });
  };
//备份所有路由
  routeContext.keys().forEach(filename => {
    let obj = routeContext(filename).default;
    routesTemp.push({...obj, children: obj.children || []});
  });
//先加载主路由
  routesTemp.forEach(o => {
    if (!o.parents) routes.push(o);
  });
//递归加载嵌套路由
  routes.forEach(o => {
    recursion(o.children, o.name);
  });

  const router = new Router({
    base: process.env.VUE_APP_PKGNAME,
    routes: [].concat(customRoutes, routes), mode: 'history',
    scrollBehavior(to, from, savedPosition) {
      console.log('savedPosition', savedPosition)
      if (savedPosition) return savedPosition;
      return {x: 0, y: 0};
    },
  });

  console.log('router', [].concat(customRoutes, routes));

  const onErrorHandler = err => {
    console.log('onErrorHandler', err)
    Vue.prototype.$$Dialog({
      title: "提示", message: err?.desc || "鉴权失败，请重试！",
    }).then(() => history.back(-1));
  };

  // 增加路由跳转前拦截
  router.beforeEach((to, from, next) => {
    NProgress.start();
    Vue.prototype.$$store.commit("storage/CHECK_STORAGE");
    if (to.meta.isSkeleton) to.meta.skeletonFlag = !0;
    // if (from.meta.isBackToHome) return Vue.prototype.$$publicBack();
    if (beforeEach) return next(beforeEach(to, from));//处理失败
    const urlParams = to.query;
    console.log('beforeEach', to, from, urlParams)
    Vue.prototype.$$store.commit("user/SET_URL_PARAMS", urlParams);//保存所有的url参数
    Vue.prototype.$$store.dispatch("user/CHECK_STORAGE");//检查缓存
    // return next();
    // keepAlive逻辑 返回时清除pageLevel大于等于from的pageLevel的页面
    if (to.meta.pageLevel < from.meta.pageLevel) {
      // 返回前面的页面
      if (from.meta.keepAlive) Vue.prototype.$$store.dispatch("keepAlive/REMOVE_ALIVE_PAGE", from);
    } else {
      if (to.meta.keepAlive) Vue.prototype.$$store.dispatch("keepAlive/ADD_ALIVE_PAGE", to);
    }

    if (to.meta.authentication) {
      const token = Vue.prototype.$$store.getters['user/GET_TOKEN'];
      console.log("beforeEach store token--->", token);
      //
      //   //有token  和缓存不同 重新获取
      //   if (!token && ['OA', 'YXS'].includes(urlParams.from_sys) && urlParams.t) return toGetUserInfo(urlParams.t, next);//没有token OA,YXS跳转
      //   if (token && urlParams.token && token !== urlParams.token) return toGetUserInfo(urlParams.token, next);
      //   if (token) return Vue.prototype.$$store.getters['user/GET_STAFF_ID'] ? next() : toGetUserInfo(token, next);
      //   //没有token 看下url里有没有 有的话第一次进来
      //   if (urlParams.token) return toGetUserInfo(urlParams.token, next);
      if (!token) return next({name: 'Login', query: {redirect: to.name}});
      const userInfo = Vue.prototype.$$store.getters['user/GET_USER_INFO'];
      console.log("beforeEach store userInfo--->", userInfo);
      if (!userInfo) return Vue.prototype.$$store.dispatch('user/DO_GET_USERINFO').then(() => {
        next();
      }).catch(err => onErrorHandler(err));
      next();
      //   onErrorHandler();

      // if (!token) {
      //   if (urlParams.token) {
      //     Vue.prototype.$$store.commit("user/SET_TOKEN", urlParams.token);//保存所有的url参数
      //     return Vue.prototype.$$store.dispatch("user/GET_OA_QUERY_CURRENT_INFO", urlParams.token).then(() => {
      //       next();
      //     }).catch(err => onErrorHandler(err));
      //   }
      //   onErrorHandler()
      // } else {
      //   //有token
      //   Vue.prototype.$$store.dispatch("user/GET_OA_QUERY_CURRENT_INFO").then(() => {
      //     next();
      //   }).catch(err => onErrorHandler(err));
      // }
    } else {
      next();
    }
  });

  // 增加路由跳转后拦截
  router.afterEach((to, from) => {
    NProgress.done();
    if (to.meta.isSkeleton) to.meta.skeletonFlag = !1;
    afterEach && afterEach(to, from, Vue.prototype);
    !to.meta.noSetDocumentTitle && (document.title = to.meta.title || '');
    // document.getElementById('app').scrollTo(0, 0);
  });

  return router;
};
