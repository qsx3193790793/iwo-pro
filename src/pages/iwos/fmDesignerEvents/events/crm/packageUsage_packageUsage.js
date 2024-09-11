export const key = 'packageUsage_packageUsage';
export const label = '服务一致性_量本使用查询';
export const resFields = [
  {label: '套内流量总量', value: 'initValFlow'},
  {label: '套内流量剩余量', value: 'accuValFlow'},
  {label: '套内流量使用量', value: 'usageValFlow'},
  {label: '套内语音总量', value: 'initValVoice'},
  {label: '套内语音剩余量', value: 'accuValVoice'},
  {label: '套内语音使用量', value: 'usageValVoice'},
  {label: '套内短信总量', value: 'initValSMS'},
  {label: '套内短信剩余量', value: 'accuValSMS'},
  {label: '套内短信使用量', value: 'usageValSMS'}
];

export default async ({vm, item, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.ecAccuUseQry({
    // params: {provinceId: '8130000'},
    data: {
      "lanId": lanIdInfo.lanid,
      "objValue": accNum,
      "objAttr": accType,
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const v = vm.$$lodash.get(res?.accountInfoList?.[0] || {}, valueKey);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
