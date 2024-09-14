import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
const apis = {
  // 查询应用系统树列表
  listappConfig: {url: `${apiPrefix('config')}/tAppInfo/page`, method: 'get'},
  // 新增应用系统
  addappConfig: {url: `${apiPrefix('config')}/tAppInfo/addAppInfo`, method: 'post'},
  // 修改应用系统
  updateappConfig: {url: `${apiPrefix('config')}/tAppInfo/updAppInfo`, method: 'put'},
  // 删除应用系统
  delappConfig: {url: (args) => `${apiPrefix('config')}/tAppInfo/${args?.appIds || ''}`, method: 'put'},
  // 修改应用状态（启用/停用）
  updStatusappConfig: {url: `${apiPrefix('config')}/tAppInfo/updStatus`, method: 'put'},
  //查询应用系统详情
  appConfigDetail: {url: (args) =>`${apiPrefix('config')}/tAppInfo/getAppInfoById/${args?.appId || ''}`, method: 'get'},
   //查询应用系统编号
   getClientId: {url: (args) =>`${apiPrefix('config')}/tAppInfo/generateClientId`, method: 'get'},

};

export default apiGenerator(apis);
