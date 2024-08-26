
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
export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  // const {res, err} = await vm.$$api.crm.ECQueryBalance({
  //   params: {provinceId: lanIdInfo.provinceCode},
  //   data: {
  //     "operAttrStruct": {
  //       "staffId": 1111,
  //       "operOrgId": 11111,
  //       "lanId": lanIdInfo.lanid,
  //     },
  //     "svcObjectStruct": {
  //       "objType": "3",
  //       "objValue": accNum,
  //       // accType 移动手机12  宽带11  固话10
  //       // objAttr 移动手机2   宽带3   固话0
  //       "objAttr": ({'12': '2', '11': '3', '10': '0'})[accType],
  //     }
  //   }
  // });
  console.log('eventsFields', vm, item, item.eventsFields)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
