import apiGenerator from "../apiGenerator";
import apiPrefix from "../apiPrefix";

const apis = {
  // 获取统一投诉编码 和 集团工单编号
  fileList: {url:(args) => `${apiPrefix("file")}/tWorkOrderAttachment/getTWorkOrderAttachmentById/${args?.workorderId || ''}`,method:'get'},
  fileUpload: {url: `${apiPrefix("file")}/tAttachment/uploadAtt`, method:'post'},
  fileDelete: {url: (args) =>`${apiPrefix("file")}/tAttachment/${args?.attIds || ''}`, method:'put'},
  fileDownload: {url: `${apiPrefix("file")}/tAttachment/downloadAttachment`, method:'post',responseType:'blob'},
};

export default apiGenerator(apis);
