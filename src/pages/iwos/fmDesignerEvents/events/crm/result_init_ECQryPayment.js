export const key = 'result_init_ECQryPayment';
export const label = '服务一致性_充值缴费列表结果赋值';
export const resFields = [
  {"label": "帐户标识", "value": "acctId"},
  {"label": "主从账户关系", "value": "acctRelFlag"},
  {"label": "省份标识", "value": "province"},
  {"label": "本地网标识", "value": "lanId"},
  {"label": "合并付费类型", "value": "acctRelType"},
  {"label": "付款流水号", "value": "paymentId"},
  {"label": "付款方式", "value": "paymentMethod"},
  {"label": "缴费渠道编码", "value": "paymentChannel"},
  {"label": "缴费渠道名称", "value": "paymentChannelName"},
  {"label": "缴费金额", "value": "amount"},
  {"label": "缴费时间", "value": "paymentDate"},
  {"label": "余额类型标识", "value": "balanceTypeId"},
  {"label": "余额使用范围", "value": "accNbrDetail"},
  {"label": "缴费预存余额", "value": "balance"}
];
export default async ({vm, item, eventsFields, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const v = vm.$$lodash.get(value || {}, valueKey);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
