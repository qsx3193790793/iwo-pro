import apiGenerator from "../apiGenerator";
import apiPrefix from "../apiPrefix";
//投诉单建单
const apis = {
  // 提交
  saveComplaintWorkOrder: {
    url: `${apiPrefix("web")}/complaintWorkOrder/saveComplaintWorkOrder`,
  },
  // 列表
  listComplaint: { url: `${apiPrefix("web")}/createOrder/list`, method: "get" },
  // -------------------------------------------归档--------------------------
  // 归档列表
  listOnFile: { url: `${apiPrefix("web")}/workOrder/archiveList`, method: "get" },
  // 归档审批
  examineOnFile: { url: `${apiPrefix("web")}/workOrder/groupOrderArchives`, method: "post" },
};

export default apiGenerator(apis);
