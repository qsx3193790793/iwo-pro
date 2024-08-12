//测试
export const key = 'crm_eCCustomer';
export const label = '服务一致性_客户信息及画像';

export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  console.log('eventsFields', vm, eventsFields)
  vm.$nextTick(() => {
    eventsFields.forEach(ef => {
      const value = vm.$$lodash.get(custom || {}, ef.value);
      console.log(`$template$${ef.label}`, value, vm.$$isEmpty(value))
      if (vm.$$isEmpty(value)) return;
      vm.formData[`$template$${ef.label}`] = value;
    });
  });
}
