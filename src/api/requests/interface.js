// 模板管理
import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 列表
  list: {url: `${apiPrefix('config')}/tInterfaceInfo/page`, method: 'get'},
  //请求接口
  requestApi: {url: `${apiPrefix('config')}/tInterfaceInfo/requestApi`},
  //删除
  delete: {url: (args) => `${apiPrefix('config')}/tInterfaceInfo/${args?.interfaceIds || ''}`, method: 'put'},
  // 变更状态
  changeStatus: {url: (args) => `${apiPrefix('config')}/tInterfaceInfo/updStatus`, method: 'put'},
  // 测试接口
  testApi: {url: `${apiPrefix('config')}/tInterfaceInfo/testApi`, method: 'POST'},
  // 新建
  create: {url: `${apiPrefix('config')}/tInterfaceInfo/addInterfaceInfo`, method: 'POST'},
  // 修改
  update: {url: `${apiPrefix('config')}/tInterfaceInfo/updInterfaceInfo`, method: 'put'},
  // 详情
  detail: {url: (args) => `${apiPrefix('config')}/tInterfaceInfo/getInterfaceInfoById/${args?.interfaceId || ''}`, method: 'get'},
  // 刷新缓存
  refreshCache: {url:`${apiPrefix('config')}/tInterfaceInfo/refreshCache`, method: 'get'},
};

export default apiGenerator(apis);
