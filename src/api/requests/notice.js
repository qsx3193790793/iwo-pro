import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询公告列表
  listNotice: {url: `${apiPrefix('system')}/notice/list`, method: 'get'},
  // 查询公告详细
  getNotice: {url: (args) => `${apiPrefix('system')}/notice/${args?.noticeId || ''}`, method: 'get'},
  // 新增公告
  addNotice: {url: `${apiPrefix('system')}/notice`, method: 'post'},
  // 修改公告
  updateNotice: {url: `${apiPrefix('system')}/notice`, method: 'put'},
  // 删除菜单
  delNotice: {url: (args) => `${apiPrefix('system')}/notice/${args?.noticeId || ''}`, method: 'delete'},
};

export default apiGenerator(apis);
