//测试
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

export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.eCAccount({
    params: {
      serialNumber: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
    }
  });
  // if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  // 模板会字段统一会加$template$前缀用来区分
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
  // console.log(res)
}
