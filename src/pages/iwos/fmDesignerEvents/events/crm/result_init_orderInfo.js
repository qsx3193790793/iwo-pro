export const key = 'result_init_orderInfo';
export const label = '服务一致性_订单列表查询结果赋值';
export const resFields = [
  {"label": "合作商订单号", "value": "extCustOrderId"},
  {"label": "集团订单号", "value": "custOrderId"},
  {"label": "省份订单号", "value": "provCustOrderId"},
  {"label": "号码", "value": "serialNumber"},
  {"label": "订单状态", "value": "orderStatus"},
  {"label": "订单状态名称", "value": "orderStatusName"},
  {"label": "状态时间", "value": "statusDate"},
  {"label": "订单受理渠道", "value": "channelNbr"},
  {"label": "受理员工编码", "value": "staffCode"},
  {"label": "受理时间", "value": "acceptDate"},
  {"label": "本地网标识", "value": "lanId"},
  {"label": "备注", "value": "remark"},
  // { "label": "订单属性", "value": "attributes" },
  // { "label": "订单项信息", "value": "orderItems" },
  // { "label": "属性编码", "value": "attributes[0].attrId" },
  // { "label": "属性名称", "value": "attributes[0].name" },
  // { "label": "属性值", "value": "attributes[0].value" },
  // { "label": "订单项标识", "value": "orderItems[0].orderItemId" },
  // { "label": "服务提供标识", "value": "orderItems[0].serviceOfferId" },
  // { "label": "订单-销售品实例信息", "value": "orderItems[0].ordOfferInst" },
  // { "label": "订单-产品实例", "value": "orderItems[0].ordProdInst" },
  // { "label": "销售品业务编码", "value": "orderItems[0].ordOfferInst[0].offerNbr" },
  // { "label": "销售品名称", "value": "orderItems[0].ordOfferInst[0].offerName" },
  // { "label": "销售品实例标识", "value": "orderItems[0].ordOfferInst[0].offerInstId" },
  // { "label": "产品业务编码", "value": "orderItems[0].ordProdInst[0].prodNbr" },
  // { "label": "产品名称", "value": "orderItems[0].ordProdInst[0].prodName" },
  // { "label": "产品实例标识", "value": "orderItems[0].ordProdInst[0].prodInstId" }
];
export default async ({vm, item, eventsFields, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const v = vm.$$lodash.get(value || {}, valueKey);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
