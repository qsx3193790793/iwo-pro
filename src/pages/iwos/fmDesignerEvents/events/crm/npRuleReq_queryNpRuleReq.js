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
export default async ({vm, item, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.queryNpRuleReq({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
      prodClass: accType,
      status: 1
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const r = Object.assign(res || {}, {reasons: res?.reasons?.join(',')});
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(r, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
