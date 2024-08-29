import apiGenerator from "../apiGenerator";
import apiPrefix from "../apiPrefix";
//投诉单建单
const apis = {
  // 提交
  saveComplaintWorkOrder: {url: `${apiPrefix("web")}/complaintWorkOrder/saveComplaintWorkOrder`},
  // 暂存
  temporarySaveComplaintWorkOrder: {url: `${apiPrefix("web")}/complaintWorkOrder/temporarySaveComplaintWorkOrder`},
  // 办结
  temporaryCompletedComplaintWorkOrder: {url: `${apiPrefix("srv")}/completedWorkOrder`},

  // 取消
  temporaryCancelComplaintWorkOrder: {url: `${apiPrefix("web")}/createOrder/updStatusCd`, method: "put"},
  // 查询流程定义ID
  getProcessDefinitionId: {url: `${apiPrefix("web")}/complaintWorkOrder/getProcessDefinitionId`, method: "get"},
  // 详情
  complaintWorkOrderDetail: {url: (args) => `${apiPrefix("web")}/complaintWorkOrder/complaintWorkOrderDetail/${args.workorderId}`, method: "get"},
  // 查询是否存在在途单 0==不存在在途工单 1==存在在途工单
  queryPendingWorkOrderByAssetNum: {url: `${apiPrefix("web")}/complaintWorkOrder/queryPendingWorkOrderByAssetNum`, method: "get"},
  // 列表
  listComplaint: {url: `${apiPrefix("web")}/createOrder/list`, method: "get"},
  //我的待办-待提交投诉单
  waitCommitList: {url: `${apiPrefix("web")}/createOrder/waitCommitList`, method: "get"},
  // 获取集团工单编号
  getComplaintWorksheetId: {url: `${apiPrefix("web")}/workOrder/getComplaintWorksheetId`, method: "get"},
  //一键信息获取
  diagnosisHandleInfo: {url: `${apiPrefix('web')}/diagnosis/handleInfo`, method: 'post'},
  //工信部导入
  miitImport: {url: `${apiPrefix('web')}/importWorkOrder/miit`, method: 'post'},
  //省管局导入
  provinceAuthorityImport: {url: `${apiPrefix('web')}/importWorkOrder/provinceAuthority`, method: 'post'},
  //工信部模板下载
  miitTemplate: {url: `${apiPrefix('web')}/importWorkOrder/miitTemplate`, method: 'post', responseType: 'blob'},
  //省管局模板下载
  provinceAuthorityTemplate: {url: `${apiPrefix('web')}/importWorkOrder/provinceAuthorityTemplate`, method: 'post', responseType: 'blob'},

  //投诉现象
  queryPhenomPullList: {url: `${apiPrefix("web")}/phenom/web/queryPhenomPullList`, method: "get"},
  //投诉原因
  queryReasonPullList: {url: `${apiPrefix("web")}/phenom/web/queryReasonPullList`, method: "get"},
  //产品
  channelTree: {url: `${apiPrefix("web")}/tChannel/channelTree`, method: "get"},

  // 查询模板现象类表单
  formPhenomenon: {url: (args) => `${apiPrefix('web')}/template/form/phenomenon/${args.sceneCode ?? ''}/${args.bigType ?? ''}/${args?.workorderType ?? ''}`, method: 'get'},
  // 查询模板来源类表单
  formSource: {url: (args) => `${apiPrefix('web')}/template/form/source/${args.sceneCode ?? ''}/${args.bigType ?? ''}/${args?.workorderType ?? ''}`, method: 'get'},
  // 查询模板通用类表单
  formCommon: {url: (args) => `${apiPrefix('web')}/template/form/common/${args.sceneCode ?? ''}/${args.bigType ?? ''}/${args?.workorderType ?? ''}`, method: 'get'},
};

export default apiGenerator(apis);
