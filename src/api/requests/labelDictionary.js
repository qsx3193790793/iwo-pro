import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // 查询标签字典列表
  listDictTag: {url: `${apiPrefix('config')}/tDictTag/list`, method: 'get'},
  // 查询标签字典详细
  getChannelDetail: {url:  (args) => `${apiPrefix('config')}/tDictTag/${args?.tDictTagId || ''}`, method: 'get'},
  // 新增标签字典
  addDictTag: {url: `${apiPrefix('config')}/tDictTag`, method: 'post'},
  // 修改标签字典
  updateDictTag: {url: `${apiPrefix('config')}/tDictTag`, method: 'put'},
  // 删除标签字典
  delChannel: {url: (args) => `${apiPrefix('config')}/tDictTag/${args?.tDictTagIds || ''}`, method: 'put'},
};

export default apiGenerator(apis);
