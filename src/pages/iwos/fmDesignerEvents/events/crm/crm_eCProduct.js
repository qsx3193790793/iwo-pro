export const key = 'crm_eCProduct';
export const label = '服务一致性_用户信息查询';
export const resFields = [
  {"label": "用户内部ID", "value": "id"},
  {"label": "账户ID", "value": "accountId"},
  {"label": "登记地址", "value": "address"},
  {"label": "城市", "value": "city"},
  {"label": "客户ID", "value": "custId"},
  {"label": "失效时间", "value": "endDate"},
  {"label": "付费周期", "value": "payCycle"},
  {"label": "产品名称", "value": "productName"},
  {"label": "省份", "value": "province"},
  {"label": "业务号码", "value": "serialNumber"},
  {"label": "安装时间", "value": "startDate"},
  {"label": "帐号", "value": "account"},
  {"label": "产品实例状态", "value": "prodInstStatus"},
  {"label": "停机类型", "value": "stopType"},
  {"label": "付费模式CD", "value": "paymentModeCd"},
  // {"label": "产品属性集合","value": "attributes"},
  // {"label": "属性编码","value": "attributes[0].attrId"},
  // {"label": "属性名称","value": "attributes[0].name"},
  // {"label": "属性值","value": "attributes[0].value"}
];
export default async ({vm,item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const {res, err} = await vm.$$api.crm.eCProduct({
    params: {
      custId: '',//客户ID
      lanId: lanIdInfo.lanid,//本地网标识
      accountId: '',//账户ID
      serialNumber: accNum,//号码
      bussinessNbr: '',//账户合同号
      account: '',//账号
      prodClass: accType,
      iccid: '',//ICCID
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(res || {}, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
  console.log(res)
}
