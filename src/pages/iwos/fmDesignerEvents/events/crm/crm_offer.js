//测试
export const key = 'crm_offer';
export const label = '服务一致性_销售品信息查询';

export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning, item, value);
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.offer({
    params: {
      offerNbr: value.offerNbr,
      provinceId: lanIdInfo.lanid
    },
  });
  console.log('eventsFields', vm, item?.eventsFields)
  // 模板会字段统一会加$template$前缀用来区分
  item?.eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
