export const key = 'faultEngine_queryfaultOrderList';
export const label = '省内接口_故障单信息查询';
export const resFields = [];
export default async ({vm, item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const {res, err} = await vm.$$api.crm.queryfaultOrderList({
    data: {
      accNum: accNum,//   手机号码
      faultOrderId: '',
      startTime: "",
      endTime: "",
      lanId: lanIdInfo.lanid,//  本地网标识
      prodClass: accType
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
