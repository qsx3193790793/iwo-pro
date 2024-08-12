import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//服务一致性接口
const apis = {
  // crm
  // //  客户信息接口调用
  // eCCustomer: {url: `${apiPrefix('web')}/crm/eCCustomer`, method: 'get'},
  //  账户信息接口调用
  eCAccount: {url: `${apiPrefix('web')}/crm/eCAccount`, method: 'get'},
  //  用户信息接口调用
  eCProduct: {url: `${apiPrefix('web')}/crm/eCProduct`, method: 'get'},
  //  功能产品
  funcationalProduct: {url: `${apiPrefix('web')}/funcationalProduct`, method: 'get'},
  //  订单信息
  orderInfo: {url: `${apiPrefix('web')}/orderInfo`, method: 'get'},
  //  历史订购
  orderHistory: {url: `${apiPrefix('web')}/orderHistory`, method: 'get'},
  //  销售品
  offer: {url: `${apiPrefix('web')}/offer`, method: 'get'},
  //  我的套餐接口调用
  myProductOffer: {url: `${apiPrefix('web')}/crm/myProductOffer`, method: 'get'},
  //  充值缴费明细
  ECQryPayment: {url: `${apiPrefix('web')}/billing/ECQryPayment`, method: 'POST'},
  //  账单查询
  ECQryCustBill: {url: `${apiPrefix('web')}/billing/ECQryCustBill`, method: 'POST'},
  //  余额查询
  ECQueryBalance: {url: `${apiPrefix('web')}/billing/ECQueryBalance`, method: 'POST'},
  //  欠费查询
  ecQryBill: {url: `${apiPrefix('web')}/billing/ecQryBill`, method: 'POST'},
  //  量本使用查询
  ecAccuUseQry: {url: `${apiPrefix('web')}/billing/ecAccuUseQry`, method: 'POST'},

  //省内
  //积分基本信息查询
  pointsBasicInfo: {url: `${apiPrefix('web')}/jfpt/pointsBasicInfo`, method: 'post'},
  //装维信息查询
  installationInfo: {url: `${apiPrefix('web')}/order/installationInfo`, method: 'post'},
  //故障历史查询
  queryHistryfaultOrder: {url: `${apiPrefix('web')}/HistryfaultOrder/queryHistryfaultOrder`, method: 'post'},
  //套餐使用情况查询
  packageUsage: {url: `${apiPrefix('web')}/PackageUsage/packageUsage`, method: 'post'},
  //携号诊断查询
  queryNpRuleReq: {url: `${apiPrefix('web')}/NpRuleReq/queryNpRuleReq`, method: 'post'},
  //订单详情查询
  customerOrderDetail: {url: `${apiPrefix('web')}/acceptOrders/customerOrderDetail`, method: 'post'},
  //订单信息查询
  customerOrderList: {url: `${apiPrefix('web')}/acceptOrders/customerOrderList`, method: 'post'},
  //设备开卡信息查询
  cardOpenInfo: {url: `${apiPrefix('web')}/cust/cardOpenInfo`, method: 'post'},
  //销售品信息查询
  getpromInfo: {url: `${apiPrefix('web')}/cust/getpromInfo`, method: 'post'},
  //客户画像查询
  customerProfileInfo: {url: `${apiPrefix('web')}/cust/customerProfileInfo`, method: 'post'},
  //设备状态信息查询
  deviceStatusInfo: {url: `${apiPrefix('web')}/cust/deviceStatusInfo`, method: 'post'},
  //查询设备产品信息
  devCustInfo: {url: `${apiPrefix('web')}/cust/devCustInfo`, method: 'post'},
  //故障单信息查询
  queryfaultOrderList: {url: `${apiPrefix('web')}/faultEngine/queryfaultOrderList`, method: 'post'},
  //信息一键获取
  handleInfo: {url: `${apiPrefix('web')}/diagnosis/handleInfo`, method: 'post'},
  //普通查询客户基本信息
  queryCommonCustInfo: {url: `${apiPrefix('web')}/cust/queryCommonCustInfo`, method: 'post'},
  //强制查询客户基本信息
  queryForceCustInfo: {url: `${apiPrefix('web')}/cust/queryForceCustInfo`, method: 'post'},
  //获取H码
  getHNumber: {url: `${apiPrefix('web')}/HNumber/get`, method: 'get'},
  // 获取GIS地址列表
  getGisAddressList: {url: `${apiPrefix('web')}/gss/getGisAddressList`, method: 'get'},
  // 工单画像
  sourceCountUserPicuture: {url: `${apiPrefix('web')}/sourceCount/userPicuture`, method: 'get'},
};

export default apiGenerator(apis);
