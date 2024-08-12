//测试
export const key = 'acceptOrders_customerOrderDetail';
export const label = '省内接口_订单详情查询';

export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning, item, value);
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.customerOrderDetail({
    data: {
      orderId: value.orderId, lanId: lanIdInfo.lanid, prodClass: accType
    }
  });
  console.log('eventsFields', vm, item?.eventsFields)
  // 模板会字段统一会加$template$前缀用来区分
  item?.eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    console.log('eventsFields forEach', ef.value, value, vm.$$isEmpty(value))
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
