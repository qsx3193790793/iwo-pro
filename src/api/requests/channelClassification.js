import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // 查询渠道树列表
  listChannelTree: {url: `${apiPrefix('config')}/tChannel/channelTree`, method: 'get'},
  // 查询投诉渠道列表
  listChannel: {url: `${apiPrefix('config')}/tChannel/list`, method: 'get'},
  // 查询渠道详细
  getChannelDetail: {url:  (args) => `${apiPrefix('config')}/tChannel/getChannelByIdForUpd/${args?.channelId || ''}`, method: 'get'},
  // 投诉渠道编码
  getchannelCode: {url: `${apiPrefix('config')}/tChannel/genChannelCode`, method: 'post'},
  // 新增渠道
  addChannel: {url: `${apiPrefix('config')}/tChannel/addChannel`, method: 'post'},
  // 修改渠道
  updateChannel: {url: `${apiPrefix('config')}/tChannel/updChannel`, method: 'put'},
  // 修改投诉渠道状态（启用/停用）
  updStatus: {url: `${apiPrefix('config')}/tChannel/updStatus`, method: 'put'},
  // 删除渠道
  delChannel: {url: (args) => `${apiPrefix('config')}/tChannel/${args?.channelIds || ''}`, method: 'put'},
};

export default apiGenerator(apis);
