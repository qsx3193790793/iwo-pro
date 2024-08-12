//这个页面是个路由页面，导出格式为一条路由，参照vue-router文档 访问样例 host.com/NWSONDisplaySystem#/{path}
export default {
  path: '/layout',
  name: 'Layout',
  component: () => import('./index.vue'),
  meta: {
    title: '智慧客服工单系统',
    authentication: true,//该页面是否需要登陆才可进入
    pageLevel: 1
  }
};
