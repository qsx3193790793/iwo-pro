//测试
export const key = 'crm_myProductOffer';
export const label = '服务一致性_我的套餐';

export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.myProductOffer({
    params: {
      serialNumber: accNum,//号码
      lanId: lanIdInfo.lanid,//  本地网标识
      custId: '',//客户ID
      account: '',//账号
    }
  });
  console.log('eventsFields', eventsFields)
  const main = (res?.list || []).find(tc => ['10', '11'].includes(tc.type));
  // 模板会字段统一会加$template$前缀用来区分
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(main || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
