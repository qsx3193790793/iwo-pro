export const key = 'crm_eCAccount';
export const label = '服务一致性_账户信息查询';
export const resFields = [
  {"label": "账户ID", "value": "id"},
  {"label": "账户名称", "value": "name"},
  {"label": "分账序号(合同号)", "value": "bussinessNbr"},
  {"label": "省份", "value": "province"},
  {"label": "城市", "value": "city"},
  {"label": "客户标识", "value": "custId"}
];

export default async ({vm, item, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.eCAccount({
    params: {
      serialNumber: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
      prodClass: accType,
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  // if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(res || {}, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
  // console.log(res)
}
