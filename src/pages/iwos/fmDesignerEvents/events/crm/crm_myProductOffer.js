export const key = 'crm_myProductOffer';
export const label = '服务一致性_我的套餐';
export const resFields = [
  {"label": "主套餐ID", "value": "id"},
  {"label": "主套餐名称", "value": "name"},
  {"label": "顺序", "value": "seq"},
  {"label": "类型", "value": "type"},
  {"label": "订购时间", "value": "orderDate"},
  {"label": "生效时间", "value": "startDate"},
  {"label": "失效时间", "value": "endTime"},
  {"label": "销售品编码", "value": "number"},
  // {"label": "相关产品集合", "value": "relatedProducts"},
  // {"label": "用户实例ID", "value": "relatedProducts[0].productId"},
  // {"label": "角色", "value": "relatedProducts[0].role"},
  // {"label": "用户号码", "value": "relatedProducts[0].serialNumber"}
];
export default async ({vm, item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const {res, err} = await vm.$$api.crm.myProductOffer({
    params: {
      serialNumber: accNum,//号码
      lanId: lanIdInfo.lanid,//  本地网标识
      prodClass: accType,
      custId: '',//客户ID
      account: '',//账号
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  const r = (res?.list || []).find(tc => ['10', '11'].includes(tc.type)) || {};
  const main = Object.assign(r, {
    startDate: vm.$$dateFormatterYMDHMS(r?.startDate),
    endTime: vm.$$dateFormatterYMDHMS(r?.endTime),
  });

  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(main, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
