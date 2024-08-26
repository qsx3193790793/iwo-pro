
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
export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.pointsBasicInfo({
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
