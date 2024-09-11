export const key = 'cust_deviceStatusInfo';
export const label = '省内接口_设备状态信息查询';
export const resFields = [
  {"label": "产品实例状态", "value": "statusCd"},
  {"label": "产品实例状态名称", "value": "statusName"},
  {"label": "停机类型", "value": "stopType"},
  {"label": "停机类型名称", "value": "stopTypeName"},
  {"label": "停机时间", "value": "stopDate"},
  {"label": "停机原因", "value": "stopReason"},
  {"label": "复机时间", "value": "recoveryTime"}
];
export default async ({vm, item, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.deviceStatusInfo({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(res || {}, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
