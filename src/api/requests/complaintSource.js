import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//
const apis = {
  // 查询投诉来源树列表
  listComplaintSourceTree: {url: `${apiPrefix('config')}/complaintSource/findSourceTree`, method: 'post'},
  // 根据当前登陆用户ID获取投诉来源树结构接口
  getAskSourceSrlByUid: {url: `${apiPrefix('config')}/complaintSource/getAskSourceSrlByUid`, method: 'post'},
  // 查询投诉来源列表
  listComplaintSource: {url: `${apiPrefix('config')}/complaintSource/findSourceList`, method: 'get'},
  // 查询投诉来源详细
  getComplaintSourceDetail: {url: (args) => `${apiPrefix('config')}/complaintSource/${args?.sourceId || ''}`, method: 'get'},
  // 投诉来源编码
  getComplaintSourceCode: {url: `${apiPrefix('config')}/complaintSource/genSourceCode`, method: 'post'},
  // 新增投诉来源
  addComplaintSource: {url: `${apiPrefix('config')}/complaintSource/saveSource`, method: 'post'},
  // 修改投诉来源
  updateComplaintSource: {url: `${apiPrefix('config')}/complaintSource/updateSource`, method: 'post'},
  // 修改投诉来源状态（启用/停用）
  updStatus: {url: `${apiPrefix('config')}/complaintSource/updateSourceStatus`, method: 'post'},
  // 删除投诉来源
  delComplaintSource: {url: `${apiPrefix('config')}/complaintSource/deleteSourceByIds`, method: 'post'},
  //根据pCode获取投诉产品列表(投诉产品下拉框使用)
  selectLowerLevelComplaintSourceList: {url: `${apiPrefix('config')}/complaintSource/selectLowerLevelComplaintSourceList`, method: 'get'},
};

export default apiGenerator(apis);
