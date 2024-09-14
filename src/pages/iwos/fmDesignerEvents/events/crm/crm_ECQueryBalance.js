export const key = 'crm_ECQueryBalance';
export const label = '服务一致性_余额查询';
export const resFields = [
  {"label": "帐户标识", "value": "acctId"},
  {"label": "主从账户关系", "value": "acctRelFlag"},
  {"label": "省份标识", "value": "province"},
  {"label": "本地网标识", "value": "lanId"},
  {"label": "合并付费类型", "value": "acctRelType"},
  {"label": "实时可用总余额", "value": "realBalance"},
  {"label": "总余额", "value": "sumBalance"},
  {"label": "电话区号", "value": "areaCode"},
  {"label": "查询业务类型", "value": "queryFlag"},
  {"label": "查询余额类型", "value": "queryItemType"},
  {"label": "付费方式", "value": "paymentFlag"},
  // {"label": "帐户标识", "value": "acctId"},
  // {"label": "产品实例标识", "value": "prodInstId"},
  // {"label": "用户号码", "value": "accNbr"},
  // {"label": "余额帐本标识", "value": "acctBalanceId"},
  // {"label": "余额帐本描述", "value": "desc"},
  // {"label": "帐本余额", "value": "balance"},
  // {"label": "余额帐本当月可使用额", "value": "available"},
  // {"label": "限额类型", "value": "cycleType"},
  // {"label": "是否共享帐本", "value": "shareRuleFlag"},
  // {"label": "当月已消费值", "value": "used"},
  // {"label": "帐本状态", "value": "state"},
  // {"label": "预留余额", "value": "reserveBalance"},
  // {"label": "生效时间", "value": "effDate"},
  // {"label": "失效时间", "value": "expDate"},
  // {"label": "余额类型类别", "value": "balanceTypeFlag"},
  // {"label": "余额使用范围", "value": "accNbrDetail"},
  // {"label": "是否可提取", "value": "ifAllowDraw"}
];
export default async ({vm, item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const {res, err} = await vm.$$api.crm.ECQueryBalance({
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
