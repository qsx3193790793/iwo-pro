//测试
export const key = 'faultEngine_queryfaultOrderList';
export const label = '省内接口_故障单信息查询';
// todo 没有地方使用
export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.queryfaultOrderList({
    data: {
      accNum: accNum,//   手机号码
      faultOrderId: '',
      startTime: "",
      endTime: "",
      lanId: lanIdInfo.lanid,//  本地网标识
      prodClass: accType
    }
  });
  console.log('eventsFields', eventsFields)
  // 模板会字段统一会加$template$前缀用来区分
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
