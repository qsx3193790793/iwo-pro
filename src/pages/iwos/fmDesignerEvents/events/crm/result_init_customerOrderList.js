//测试
export const key = 'result_init_customerOrderList';
export const label = '省内接口_订单列表查询结果赋值';
export const resFields = [
  {"label": "订单编号", "value": "orderId"},
  {"label": "客户ID", "value": "custId"},
  {"label": "客户编码", "value": "custNumber"},
  {"label": "客户姓名", "value": "custName"},
  {"label": "本地网标识", "value": "lanId"},
  {"label": "业务类型", "value": "businessType"},
  {"label": "订单操作类型", "value": "operType"},
  {"label": "订单类型", "value": "custOrderType"},
  {"label": "订单状态", "value": "statusCd"},
  {"label": "状态名称", "value": "statusName"},
  {"label": "状态时间", "value": "statusDate"},
  {"label": "受理时间", "value": "acceptDate"},
  {"label": "竣工时间", "value": "compleDate"},
  {"label": "受理员工编码", "value": "staffCode"},
  {"label": "订单受理渠道", "value": "channelNbr"},
  {"label": "订单受理渠道名称", "value": "channelNbrName"},
  {"label": "外部订单标识", "value": "extCustOrderId"}
];
export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  // const {res, err} = await vm.$$api.crm.ECQueryBalance({
  //   params: {provinceId: lanIdInfo.provinceCode},
  //   data: {
  //     "operAttrStruct": {
  //       "staffId": 1111,
  //       "operOrgId": 11111,
  //       "lanId": lanIdInfo.lanid,
  //     },
  //     "svcObjectStruct": {
  //       "objType": "3",
  //       "objValue": accNum,
  //       // accType 移动手机12  宽带11  固话10
  //       // objAttr 移动手机2   宽带3   固话0
  //       "objAttr": ({'12': '2', '11': '3', '10': '0'})[accType],
  //     }
  //   }
  // });
  console.log('eventsFields', vm, item.eventsFields)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`$template$${ef.label}`] = v;
  });
}
