import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//
const apis = {
  // 查询投诉原因树列表
  listComplaintReasonTree: {url: `${apiPrefix('config')}/reason/queryReasonTreeList`, method: 'get'},
  // 查询投诉原因明细列表
  listComplaintReason: {url: `${apiPrefix('config')}/reason/queryReasonDetailList`, method: 'get'},
  // 查询投诉原因下拉列表
  queryReasonPullList: {url: `${apiPrefix('config')}/reason/queryReasonPullList`, method: 'get'},
  // 查询投诉原因详细
  //   getComplaintReasonDetail: {url:  (args) => `${apiPrefix('config')}/complaintReason/`, method: 'post'},
  // 投诉原因编码
  getComplaintReasonCode: {url: `${apiPrefix('config')}/reason/genReasonCode`, method: 'get'},
  // 新增投诉原因
  addComplaintReason: {url: `${apiPrefix('config')}/reason/addReasonInfo`, method: 'post'},
  // 修改投诉原因
  updateComplaintReason: {url: `${apiPrefix('config')}/reason/updateReasonInfo`, method: 'post'},
  // 删除投诉原因
  delComplaintReason: {url: `${apiPrefix('config')}/reason/deleteReasonInfo`, method: 'get'},
};

export default apiGenerator(apis);
