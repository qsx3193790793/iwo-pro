//测试
export const key = 'public_customization_comps_event';
export const label = '定制化组件_选择赋值';

export default ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning, item, value);
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  console.log('eventsFields', item?.eventsFields)
  // 模板会字段统一会加$template$前缀用来区分
  item?.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = v;
  });
}
