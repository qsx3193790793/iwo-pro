import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询部门列表
  listDept: {url: `${apiPrefix('system')}/dept/list`, method: 'get'},
  // 查询部门列表（排除节点）
  listDeptExcludeChild: {url: (args) => `${apiPrefix('system')}/dept/list/exclude/${args?.deptId || ''}`, method: 'get'},
  // 查询部门详细
  getDept: {url: (args) => `${apiPrefix('system')}/dept/${args?.deptId || ''}`, method: 'get'},
  // 新增部门
  addDept: {url: `${apiPrefix('system')}/dept`, method: 'post'},
  // 修改部门
  updateDept: {url: `${apiPrefix('system')}/dept`, method: 'put'},
  // 删除部门
  delDept: {url: (args) => `${apiPrefix('system')}/dept/${args?.deptId || ''}`, method: 'delete'},
};

export default apiGenerator(apis);
