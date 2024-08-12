//这个页面是个路由页面，导出格式为一条路由，参照vue-router文档 访问样例 host.com/NWSONDisplaySystem#/{path}
export default {
  parents: 'Layout',//父路由
  path: 'complaint_detail',
  name: 'ComplaintDetail',
  component: () => import('./index.vue'),
  meta: {
    belong: 'Order',//属于哪个一级菜单 填写路由name
    parentName: 'ComplaintForm',
    name: '投诉单新建',
    title: '智慧客服工单系统',
    authentication: true,//该页面是否需要登陆才可进入
    keepAlive: !0,
    pageLevel: 1
  }
};
