//这个页面是个路由页面，导出格式为一条路由，参照vue-router文档 访问样例 host.com/NWSONDisplaySystem#/{path}
export default {
  parents: "Layout", //父路由
  path: "role_auth_user/:roleId",
  name: "RoleAuthUser",
  component: () => import("./index.vue"),
  meta: {
    belong: 'System',//属于哪个主菜单name
    parentName: 'RoleIndex',//父级路由名称 用来定位导航
    name: '角色管理',
    title: '智慧客服工单系统',
    authentication: true, //该页面是否需要登陆才可进入
    keepAlive: !0,
    pageLevel: 1
  },
};
