import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // -------------------------------------------流程类型--------------------------
  flowTypeList: {url: `${apiPrefix("proccess")}/inquiry/processType`, method: "get"},
  // -------------------------------------------在途工单--------------------------
  intransitOrderList: {url: `${apiPrefix("proccess")}/inquiry/afloatWorkorder`, method: "post"},
  // -------------------------------------------历史工单--------------------------
  historyOrderList: {url: `${apiPrefix("proccess")}/inquiry/historyWorkorder`, method: "post"},

  // -------------------------------------------历史工单、在途工单 详情页---------------------------
  flowOrderDetail: {url: `${apiPrefix("proccess")}/inquiry/processDatail`, method: "get"}, 
};

export default apiGenerator(apis);
