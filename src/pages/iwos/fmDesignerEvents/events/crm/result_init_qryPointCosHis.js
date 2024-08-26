
export const key = 'result_init_qryPointCosHis';
export const label = '集团接口_积分消费历史列表结果赋值';
export const resFields = [
  {label: '积分消费时间', value: 'pointCosumeTime'},
  {label: '积分消费数额', value: 'point'},
  {label: '积分兑换流水号', value: 'exchangeID'},
  {label: '积分兑换的礼品ID', value: 'giftID'},
  {label: '兑换礼品描述', value: 'giftDes'},
  {label: '积分被捐赠的客户ID', value: 'custID'},
  {label: '积分兑换礼品的数量', value: 'giftAmount'},
  {label: '商家编号', value: 'storeID'},
  {label: '商家名称', value: 'storeName'},
  {label: '服务类型', value: 'svcType'},
  {label: '积分消费方式', value: 'pointType'},
  {label: '礼品状态', value: 'giftState'},
  {label: '兑换来源', value: 'exchangeSource'},
  {label: '服务代码', value: 'svcCode'},
  {label: '项目ID', value: 'itemID'},
  {label: '项目价值', value: 'itemValue'},
  {label: '是否有兑换记录', value: 'status'},
  {label: '订单号', value: 'orderNbr'}
];
export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  console.log('eventsFields', vm, item.eventsFields)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
