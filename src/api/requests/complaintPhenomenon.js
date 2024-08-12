import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//
const apis = {
  // 查询投诉现象树列表
  listComplaintPhenomenonTree: {url: `${apiPrefix('config')}/phenom/queryPhenomTreeList`, method: 'get'},
  // 查询投诉现象明细列表
  listComplaintPhenomenon: {url: `${apiPrefix('config')}/phenom/queryPhenomDetailList`, method: 'get'},
  // 查询投诉现象下拉列表
  queryPhenomPullList: {url: `${apiPrefix('config')}/phenom/queryPhenomPullList`, method: 'get'},
  // 查询投诉现象详细
  //getComplaintPhenomenonDetail: {url:  (args) => `${apiPrefix('config')}/complaintPhenomenon/`, method: 'post'},
  // 投诉现象编码
  getComplaintPhenomenonCode: {url: `${apiPrefix('config')}/phenom/genPhenomCode`, method: 'get'},
  // 新增投诉现象
  addComplaintPhenomenon: {url: `${apiPrefix('config')}/phenom/addPhenomInfo`, method: 'post'},
  // 修改投诉现象
  updateComplaintPhenomenon: {url: `${apiPrefix('config')}/phenom/updatePhenomInfo`, method: 'post'},
  // 修改投诉现象状态（启用/停用）
  // updStatus: {url: `${apiPrefix('config')}/tComplaintPhenomenon/updStatus`, method: 'put'},
  // 删除投诉现象
//   delComplaintPhenomenon: {url: (args) => `${apiPrefix('config')}/complaintPhenomenon/deletePhenomenonByIds/`, method: 'post'},
};

export default apiGenerator(apis);
