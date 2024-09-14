export const key = 'jfpt_pointsBasicInfo';
export const label = '省内接口_积分基本信息查询';
export const resFields = [
  {"label": "当前积分", "value": "useablePoints"},
  {"label": "总积分", "value": "sumPoints"},
  {"label": "可用积分", "value": "usedPoints"},
  {"label": "即将到期积分", "value": "expiredPoints"},
  {"label": "已兑换积分", "value": "exchangePoints"},
  {"label": "累计清零积分", "value": "accumulatedZero"},
  {"label": "当月积分", "value": "currMonthPoints"},
];
export default async ({vm, item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const {res, err} = await vm.$$api.crm.pointsBasicInfo({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
      prodClass: accType,
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
