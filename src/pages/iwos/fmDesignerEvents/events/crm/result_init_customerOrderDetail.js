
export const key = 'result_init_customerOrderDetail';
export const label = '服务一致性_订单销售品列表结果赋值';
export const resFields = [
  {"label": "订单项标识", "value": "orderItemId"},
  {"label": "服务提供标识", "value": "serviceOfferId"},
  {"label": "销售品名称", "value": "offerName"},
  {"label": "销售品ID", "value": "offerId"},
  {"label": "销售品编码省内", "value": "offerNbr"},
  {"label": "销售品编码集团", "value": "offerNbrjt"},
  {"label": "生效时间", "value": "effDate"},
  {"label": "失效时间", "value": "expDate"},
  {"label": "产品业务编码", "value": "prodNbr"},
  {"label": "产品名称", "value": "prodName"},
  {"label": "产品实例标识省份产品实例ID", "value": "prodInstId"}
];
export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('result_init_customerOrderDetail', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
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
  console.log('eventsFields', vm, value, item.eventsFields)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
