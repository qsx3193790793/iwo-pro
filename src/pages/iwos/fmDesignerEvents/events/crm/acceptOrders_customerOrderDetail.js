export const key = 'acceptOrders_customerOrderDetail';
export const label = '省内接口_订单详情查询';
export const resFields = [
  {"label": "订单编号", "value": "orderId"},
  {"label": "订单状态", "value": "statusCd"},
  {"label": "状态名称", "value": "statusCdName"},
  {"label": "设备号码", "value": "accNum"},
  {"label": "外部订单标识", "value": "extCustOrderId"},
  {"label": "发展员工标识", "value": "devStaffId"},
  {"label": "发展渠道", "value": "OrdDevStaffChannel"},
  {"label": "订单项标识", "value": "orderItemId"},
  {"label": "服务提供标识", "value": "serviceOfferId"},
  {"label": "销售品名称", "value": "ordOfferInstDto.offerName"},
  {"label": "销售品ID", "value": "ordOfferInstDto.offerId"},
  {"label": "销售品编码省内", "value": "ordOfferInstDto.offerNbr"},
  {"label": "销售品编码集团", "value": "ordOfferInstDto.offerNbrjt"},
  {"label": "生效时间", "value": "ordOfferInstDto.effDate"},
  {"label": "失效时间", "value": "ordOfferInstDto.expDate"},
  {"label": "产品业务编码", "value": "ordProdInst.prodNbr"},
  {"label": "产品名称", "value": "ordProdInst.prodName"},
  {"label": "产品实例标识省份产品实例ID", "value": "ordProdInst.prodInstId"}
];

export default async ({vm, item, eventsFields, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning, item, value);
  // 未定位直接pass  formStatus不为新建时直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.customerOrderDetail({
    data: {
      orderId: value.orderId || value.provCustOrderId, lanId: lanIdInfo.lanid, prodClass: accType
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  // 筛选事件相关字段赋值
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const r = res || {};
    const valueKey = ef.value.replace(`$${key}$`, '');
    const v = vm.$$lodash.get(Object.assign({}, r, r.orderItems?.[0] || {}), valueKey);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
