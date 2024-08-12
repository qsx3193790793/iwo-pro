//测试
export const key = 'crm_eCProduct';
export const label = '服务一致性_用户信息出查询';

export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.eCProduct({
    params: {
      custId: '',//客户ID
      lanId: lanIdInfo.lanid,//本地网标识
      accountId: '',//账户ID
      serialNumber: accNum,//号码
      bussinessNbr: '',//账户合同号
      account: '',//账号
      prodClass: '',//接入产品产品大类
      iccid: '',//ICCID
    }
  });
  console.log('eventsFields', vm, eventsFields)
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
  console.log(res)
}
