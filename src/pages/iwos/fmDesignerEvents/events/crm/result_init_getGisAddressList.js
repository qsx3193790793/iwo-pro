export const key = 'result_init_getGisAddressList';
export const label = '服务一致性_GIS地址列表结果赋值';
export const resFields = [
  {"label": "地址", "value": "address"},
  {"label": "名称", "value": "name"},
  {"label": "经度", "value": "lng"},
  {"label": "纬度", "value": "lat"}
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
