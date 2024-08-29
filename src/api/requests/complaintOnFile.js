import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // -------------------------------------------归档--------------------------
  // 归档列表
  listOnFile: {url: `${apiPrefix("web")}/workOrder/archiveList`, method: "get"},
  // 归档审批
  examineOnFile: {url: `${apiPrefix("web")}/workOrder/groupOrderArchives`, method: "post"},
};

export default apiGenerator(apis);
