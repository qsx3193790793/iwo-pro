import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//
const apis = {
  // 工作台首页查询
  workbench: {url: `${apiPrefix('system')}/notice/workbench`, method: 'get'},
};

export default apiGenerator(apis);
