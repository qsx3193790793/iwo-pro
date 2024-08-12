import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询班组列表
  listTeam: {url: `${apiPrefix('system')}/team/list`, method: 'get'},
  // 查询部门列表（排除节点）
  listDeptExcludeChild: {url: (args) => `${apiPrefix('system')}/dept/list/exclude/${args?.deptId || ''}`, method: 'get'},
  // 查询班组详细
  getTeam: {url: (args) => `${apiPrefix('system')}/team/${args?.teamId || ''}`, method: 'get'},
  // 获取部门下的班组列表
  getDeptTeamTree: {url: (args) => `${apiPrefix('system')}/team/getTeamByDeptId/${args?.deptId || ''}`, method: 'get'},
  // 获取班组所能选择的角色列表
  getTeamRoleTree: {url: (args) => `${apiPrefix('system')}/team/getTeamRole/${args?.orgId || ''}`, method: 'get'},
  // 获取部门下角色列表
  getDeptRoleTree: {url: (args) => `${apiPrefix('system')}/dept/getDeptRole/${args?.deptId || ''}`, method: 'get'},
  // 新增班组
  addTeam: {url: `${apiPrefix('system')}/team`, method: 'post'},
  // 修改班组
  updateTeam: {url: `${apiPrefix('system')}/team`, method: 'put'},
  // 删除班组
  delTeam: {url: (args) => `${apiPrefix('system')}/team/${args?.teamId || ''}`, method: 'delete'},
};

export default apiGenerator(apis);
