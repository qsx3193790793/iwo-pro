import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询用户列表
  listUser: {url: `${apiPrefix('system')}/user/list`, method: 'get'},
  // 查询用户详细
  getUser: {url: (args) => `${apiPrefix('system')}/user/${args?.userId || ''}`, method: 'get'},
  // 新增用户
  addUser: {url: `${apiPrefix('system')}/user`},
  // 修改用户
  updateUser: {url: `${apiPrefix('system')}/user`, method: 'put'},
  // 删除用户
  delUser: {url: (args) => `${apiPrefix('system')}/user/${args?.userId}`, method: 'delete'},
  // 用户密码重置 resetUserPwd(userId, password)
  resetUserPwd: {url: `${apiPrefix('system')}/user/resetPwd`, method: 'put'},
  // 用户状态修改 changeUserStatus(userId, status)
  changeUserStatus: {url: `${apiPrefix('system')}/user/changeStatus`, method: 'put'},
  // 查询用户个人信息
  getUserProfile: {url: `${apiPrefix('system')}/user/profile`, method: 'get'},
  // 修改用户个人信息
  updateUserProfile: {url: `${apiPrefix('system')}/user/profile`, method: 'put'},
  // 用户密码重置 用params  oldPassword  newPassword
  updateUserPwd: {url: `${apiPrefix('system')}/user/profile/updatePwd`, method: 'put'},
  // 用户头像上传
  uploadAvatar: {url: `${apiPrefix('system')}/user/profile/avatar`, contentType: 2},
  // 查询授权角色
  getAuthRole: {url: (args) => `${apiPrefix('system')}/user/authRole/${args?.userId || ''}`, method: 'get'},
  // 保存授权角色
  updateAuthRole: {url: `${apiPrefix('system')}/user/authRole`, method: 'put'},
  // 查询机构下拉树结构
  deptTreeSelect: {url: `${apiPrefix('system')}/user/deptTree`, method: 'get'},
  // 下载模板操作
  importTemplate: {url: `${apiPrefix('system')}/user/importTemplate`, responseType: 'blob', contentType: 1},
  // 导出
  export: {url: `${apiPrefix('system')}/user/export`, responseType: 'blob', contentType: 1},
  // 批量状态修改
  updataStatus: {url: `${apiPrefix('system')}/user/batchChangeStatus`, method: 'put'},
};

export default apiGenerator(apis);
