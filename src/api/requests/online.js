import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询在线用户列表
  list: {url: `${apiPrefix('system')}/online/list`, method: 'get'},
  // 强退用户
  forceLogout: {url: (args) => `${apiPrefix('system')}/online/${args?.tokenId}`, method: 'delete'},
};

export default apiGenerator(apis);

