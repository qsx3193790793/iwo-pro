//测试
export const key = 'result_init_getpromInfo';
export const label = '服务一致性_销售品列表结果赋值';
export const resFields = [
  {"label": "客户标识", "value": "custId"},
  {"label": "客户编码", "value": "custNumber"},
  {"label": "客户姓名", "value": "custName"},
  {"label": "设备号码", "value": "accNum"},
  {"label": "销售品名称", "value": "offerName"},
  {"label": "销售品标识", "value": "offerId"},
  {"label": "销售品实例标识", "value": "offerInstId"},
  {"label": "销售品编码省内", "value": "offerNbr"},
  {"label": "销售品编码集团", "value": "offerNbrjt"},
  {"label": "销售品状态", "value": "statusCd"},
  {"label": "销售品状态名称", "value": "statusCdName"},
  {"label": "生效方式", "value": "effway"},
  {"label": "生效方式名称", "value": "effwayName"},
  {"label": "销售品类型", "value": "offerType"},
  {"label": "销售品类型名称", "value": "offerTypeName"},
  {"label": "开通时间", "value": "beginDate"},
  {"label": "生效时间", "value": "effDate"},
  {"label": "失效时间", "value": "expDate"}
];
export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
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
  console.log('eventsFields', vm, item.eventsFields)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
