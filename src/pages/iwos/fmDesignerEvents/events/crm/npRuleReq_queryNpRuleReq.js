//测试
export const key = 'npRuleReq_queryNpRuleReq';
export const label = '省内接口_携号诊断查询';
export const resFields = [
  {"label": "设备号码", "value": "accNum"},
  {"label": "是否满足携出资格", "value": "qualify"},
  {"label": "无法携号转网原因", "value": "reasons"},
  {"label": "获取携转码时间", "value": "transCodeDate"},
  {"label": "携出时间", "value": "transOutDate"},
  {"label": "携入时间", "value": "transInDate"},
  {"label": "携转状态", "value": "status"}
];
export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.queryNpRuleReq({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
      status: 1
    }
  });
  console.log('eventsFields', eventsFields)
  // 模板会字段统一会加$template$前缀用来区分
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
