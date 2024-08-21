//测试
export const key = 'crm_myProductOffer';
export const label = '服务一致性_我的套餐';
export const resFields = [
  {"label": "主套餐ID", "value": "id"},
  {"label": "主套餐名称", "value": "name"},
  {"label": "顺序", "value": "seq"},
  {"label": "类型", "value": "type"},
  {"label": "订购时间", "value": "orderDate"},
  {"label": "生效时间", "value": "startDate"},
  {"label": "失效时间", "value": "endTime"},
  {"label": "销售品编码", "value": "number"},
  // {"label": "相关产品集合", "value": "relatedProducts"},
  // {"label": "用户实例ID", "value": "relatedProducts[0].productId"},
  // {"label": "角色", "value": "relatedProducts[0].role"},
  // {"label": "用户号码", "value": "relatedProducts[0].serialNumber"}
];
export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
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
  const r = (res?.list || []).find(tc => ['10', '11'].includes(tc.type)) || {};
  const main = Object.assign(r, {
    startDate: vm.$$dateFormatterYMDHMS(r?.startDate),
    endTime: vm.$$dateFormatterYMDHMS(r?.endTime),
  });

  // 模板会字段统一会加$template$前缀用来区分
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(main, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
