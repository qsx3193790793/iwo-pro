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

  // -------------------------------------------异常单--------------------------
  abnormalformList: {url: `${apiPrefix("web")}/complaintWorkOrder/queryOrderReceiveFailList`, method: "get"},

  // -------------------------------------------归档--------------------------
  // 归档列表
  listOnFile: {url: `${apiPrefix("web")}/workOrder/archiveList`, method: "get"},
  // 归档审批
  examineOnFile: {url: `${apiPrefix("web")}/workOrder/groupOrderArchives`, method: "post"},

  // 获取集团工单编号
  getComplaintWorksheetId: {url: `${apiPrefix("web")}/workOrder/getComplaintWorksheetId`, method: "get"},
  //一键信息获取
  diagnosisHandleInfo: {url: `${apiPrefix('web')}/diagnosis/handleInfo`, method: 'post'},
  // -------------------------------------------归档策略--------------------------
  // 分页查询归档配置
  listOnFileStrategy: {url: `${apiPrefix("config")}/archiveRule/findArchiveRulePage`, method: "get"},
  // 新增归档配置
  addOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/save`, method: 'post'},
  //根据主键Id查询归档配置
  detailOnFileStrategy: {url: (args) => `${apiPrefix('config')}/archiveRule/findArchiveRuleById/${args?.archiveRuleId || ''}`, method: 'get'},
  // 批量删除归档配置
  delteOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/deleteByIds`, method: 'post'},
  //修改归档配置根据归档配置主键Id
  updataOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/update`, method: 'post'},
  //修改启用、停用状态
  statusOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/updateStatus`, method: 'post'},
  //工信部导入
  miitImport: {url: `${apiPrefix('web')}/importWorkOrder/miit`, method: 'post'},
  //省管局导入
  provinceAuthorityImport: {url: `${apiPrefix('web')}/importWorkOrder/provinceAuthority`, method: 'post'},
  //工信部模板下载
  miitTemplate: {url: `${apiPrefix('web')}/importWorkOrder/miitTemplate`, method: 'post', responseType: 'blob'},
  //省管局模板下载
  provinceAuthorityTemplate: {url: `${apiPrefix('web')}/importWorkOrder/provinceAuthorityTemplate`, method: 'post', responseType: 'blob'},
};

export default apiGenerator(apis);
