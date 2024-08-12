import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 获取路由
  getRouters: {url: `${apiPrefix('system')}/menu/getRouters`, method: 'get'},
  // 查询菜单列表
  listMenu: {url: `${apiPrefix('system')}/menu/list`, method: 'get'},
  // 查询菜单下拉树结构
  treeselect: {url: `${apiPrefix('system')}/menu/treeselect`, method: 'get'},
  // 查询菜单列表
  listDept: {url: `${apiPrefix('system')}/menu/list`, method: 'get'},
  //查询菜单树结构
  menuTreeselect: {url: (args) => `${apiPrefix('system')}/menu/treeselect/${args?.roleId || ''}`, method: 'get'},
  // 根据角色ID查询菜单下拉树结构
  roleMenuTreeselect: {url: (args) => `${apiPrefix('system')}/menu/roleMenuTreeselect/${args?.roleId || ''}`, method: 'get'},
  // 查询菜单详细
  getMenu: {url: (args) => `${apiPrefix('system')}/menu/${args?.menuId || ''}`, method: 'get'},
  // 新增菜单
  addMenu: {url: `${apiPrefix('system')}/menu`, method: 'post'},
  // 修改菜单
  updateMenu: {url: `${apiPrefix('system')}/menu`, method: 'put'},
  // 删除菜单
  delMenu: {url: (args) => `${apiPrefix('system')}/menu/${args?.menuId || ''}`, method: 'delete'},
};

export default apiGenerator(apis);
