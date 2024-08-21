import apiGenerator from "../apiGenerator";
import apiPrefix from "../apiPrefix";

const apis = {
  // 获取统一投诉编码 和 集团工单编号
  fileList: {url: `${apiPrefix("srv")}/unifyComplaintCode/get`},
  fileUpload: {url: `${apiPrefix("srv")}/unifyComplaintCode/get`},
  fileDelete: {url: `${apiPrefix("srv")}/unifyComplaintCode/get`},
};

export default apiGenerator(apis);
