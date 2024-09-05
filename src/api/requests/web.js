import apiGenerator from "../apiGenerator";
import apiPrefix from "../apiPrefix";

const apis = {
  //投诉现象
  queryPhenomPullList: {url: `${apiPrefix("web")}/phenom/web/queryPhenomPullList`, method: "get"},
  //投诉原因
  queryReasonPullList: {url: `${apiPrefix("web")}/phenom/web/queryReasonPullList`, method: "get"},
  //渠道
  channelTree: {url: `${apiPrefix("web")}/tChannel/channelTree`, method: "get"},
  // 产品
  productTree: {url: `${apiPrefix("web")}/tProduct/productTree`, method: "get"},
  // 来源
  findSourceTree: {url: `${apiPrefix("web")}/complaintSource/findSourceTree`, method: "post"},
  // 根据登录人差来源
  getAskSourceSrlByUid: {url: `${apiPrefix("web")}/complaintSource/getAskSourceSrlByUid`, method: "post"},
  //查询自定义字典
  getCusDicts: {url: args => `${apiPrefix('web')}/dictionaryItem/type/${args.dictType}`, method: 'get'},
  //查询通用字典
  getDicts: {url: (args) => `${apiPrefix('web')}/dict/data/type/${args?.dictType || ''}`, method: 'get'},
};

export default apiGenerator(apis);
