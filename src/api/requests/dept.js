import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询机构列表
  listDept: {url: `${apiPrefix('system')}/dept/list`, method: 'get'},
  // 查询机构列表（排除节点）
  listDeptExcludeChild: {url: (args) => `${apiPrefix('system')}/dept/list/exclude/${args?.deptId || ''}`, method: 'get'},
  // 查询机构详细
  getDept: {url: (args) => `${apiPrefix('system')}/dept/${args?.deptId || ''}`, method: 'get'},
  // 新增机构
  addDept: {url: `${apiPrefix('system')}/dept`, method: 'post'},
  // 修改机构
  updateDept: {url: `${apiPrefix('system')}/dept`, method: 'put'},
  // 删除机构
  delDept: {url: (args) => `${apiPrefix('system')}/dept/${args?.deptId || ''}`, method: 'delete'},
  // 修改状态（启用/停用）
  updStatus: {url: `${apiPrefix('system')}/dept/deptStatusChange`, method: 'post'},
};

export default apiGenerator(apis);
