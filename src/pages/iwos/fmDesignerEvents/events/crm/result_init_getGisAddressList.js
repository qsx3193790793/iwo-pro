export const key = 'result_init_getGisAddressList';
export const label = '服务一致性_GIS地址列表结果赋值';
export const resFields = [
  {"label": "地址", "value": "address"},
  {"label": "名称", "value": "name"},
  {"label": "经度", "value": "lng"},
  {"label": "纬度", "value": "lat"}
];
export default async ({vm, item, eventsFields, value}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum} = vm.rootParams;
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const v = vm.$$lodash.get(value || {}, valueKey);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
