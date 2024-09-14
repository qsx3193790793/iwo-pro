export const key = 'public_customization_comps_event';
export const label = '定制化组件_选择赋值';

export default ({vm, item, eventsFields, value}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const v = vm.$$lodash.get(value || {}, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
