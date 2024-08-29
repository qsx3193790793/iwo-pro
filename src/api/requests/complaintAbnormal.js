import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // -------------------------------------------异常单--------------------------
  abnormalformList: {url: `${apiPrefix("web")}/complaintWorkOrder/queryOrderReceiveFailList`, method: "get"},
};

export default apiGenerator(apis);
