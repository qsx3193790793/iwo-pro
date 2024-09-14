export const key = 'group_getBeautifulAccountInfo';
export const label = '集团接口_靓号资产信息查询';
export const resFields = [
  {"label": "靓号等级", "value": "numLevel"},
  {"label": "预存金额", "value": "depositAmount"},
  {"label": "最低消费", "value": "minConsume"}
];

export default async ({vm, item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const {res, err} = await vm.$$api.crm.getBeautifulAccountInfo({
    params: {
      accNum: accNum,//   手机号码
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
