import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询用户列表
  listRole: {url: `${apiPrefix('system')}/role/list`, method: 'get'},
  // 查询角色详细
  getRole: {url: (args) => `${apiPrefix('system')}/role/${args?.roleId || ''}`, method: 'get'},
  // 新增用户
  addRole: {url: `${apiPrefix('system')}/role`},
  // 修改角色
  updateRole: {url: `${apiPrefix('system')}/role`, method: 'put'},
  // 删除角色
  delRole: {url: (args) => `${apiPrefix('system')}/role/${args?.roleId || ''}`, method: 'delete'},
  // 用户状态修改 changeRoleStatus(roleId, status)
  changeRoleStatus: {url: `${apiPrefix('system')}/role/changeStatus`, method: 'put'},
  // 角色数据权限
  dataScope: {url: `${apiPrefix('system')}/role/dataScope`, method: 'put'},
  // 取消用户授权角色
  authUserCancel: {url: `${apiPrefix('system')}/role/authUser/cancel`, method: 'put'},
  // 批量取消用户授权角色 用的params
  authUserCancelAll: {url: `${apiPrefix('system')}/role/authUser/cancelAll`, method: 'put'},
  // 根据角色ID查询机构树结构
  deptTreeSelect: {url: (args) => `${apiPrefix('system')}/role/deptTree/${args?.roleId || ''}`, method: 'get'},

  // 获取角色投诉来源
  getAskSourceSrlRoleList: {url: (args) => `${apiPrefix('system')}/role/getAskSourceSrlRoleId/${args?.roleId || ''}`, method: 'get'},

  // 查询角色未授权用户列表
  unallocatedUserList: {url: `${apiPrefix('system')}/role/authUser/unallocatedList/`, method: 'get'},
  // 授权用户选择
  authUserSelectAll: {url: `${apiPrefix('system')}/role/authUser/selectAll`, method: 'put'},
  // 查询角色已授权用户列表
  allocatedUserList: {url: `${apiPrefix('system')}/role/authUser/allocatedList`, method: 'get'},
  //导出
  export: {url: `${apiPrefix('system')}/role/export`, responseType: 'blob', contentType: 1},
  // 批量状态修改
  updataStatus: {url: `${apiPrefix('system')}/role/batchChangeStatus`, method: 'put'},

};

export default apiGenerator(apis);
