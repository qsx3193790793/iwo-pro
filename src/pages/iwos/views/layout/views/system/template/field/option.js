//这个页面是个路由页面，导出格式为一条路由，参照vue-router文档 访问样例 host.com/NWSONDisplaySystem#/{path}
export default {
  parents: 'Layout',//父路由
  path: 'field_index',
  name: 'FieldIndex',
  component: () => import('./index.vue'),
  meta: {
    belong: 'Config',
    name: '字段列表',
    title: '智慧客服工单系统',
    authentication: true,//该页面是否需要登陆才可进入
    keepAlive: false,
    pageLevel: 1
  }
};
