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
  // 删除公告
  delNotice: {url: (args) => `${apiPrefix('system')}/notice/${args?.noticeId || ''}`, method: 'delete'},
  // 修改公告状态
  changeNoticeStatus: {url: `${apiPrefix('system')}/notice/changeNoticeStatus`, method: 'post'},
};

export default apiGenerator(apis);
