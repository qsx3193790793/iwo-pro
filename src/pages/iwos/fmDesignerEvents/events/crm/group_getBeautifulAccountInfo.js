//测试
export const key = 'group_getBeautifulAccountInfo';
export const label = '集团接口_靓号资产信息查询';
export const resFields = [
  {"label": "靓号等级", "value": "numLevel"},
  {"label": "预存金额", "value": "depositAmount"},
  {"label": "最低消费", "value": "minConsume"}
];

export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.getBeautifulAccountInfo({
    params: {
      accNum: accNum,//   手机号码
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
