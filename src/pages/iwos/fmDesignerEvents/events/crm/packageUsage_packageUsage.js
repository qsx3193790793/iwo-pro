
export const key = 'packageUsage_packageUsage';
export const label = '省内接口_套餐使用情况查询';
export const resFields = [
  {"label": "套内流量总量", "value": "initValFlow"},
  {"label": "套内流量剩余量", "value": "accuValFlow"},
  {"label": "套内流量使用量", "value": "usageValFlow"},
  {"label": "套内语音总量", "value": "initValVoice"},
  {"label": "套内语音剩余量", "value": "accuValVoice"},
  {"label": "套内语音使用量", "value": "usageValVoice"}
];
export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.packageUsage({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  console.log('eventsFields', eventsFields)
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
