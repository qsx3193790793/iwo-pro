//测试
export const key = 'crm_ECQueryBalance';
export const label = '服务一致性_余额查询';

export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.ECQueryBalance({
    params: {provinceId: lanIdInfo.provinceCode},
    data: {
      "operAttrStruct": {
        "staffId": 1111,
        "operOrgId": 11111,
        "lanId": lanIdInfo.lanid,
      },
      "svcObjectStruct": {
        "objType": "3",
        "objValue": accNum,
        // accType 移动手机12  宽带11  固话10
        // objAttr 移动手机2   宽带3   固话0
        "objAttr": ({'12': '2', '11': '3', '10': '0'})[accType],
      }
    }
  });
  console.log('eventsFields', vm, eventsFields)
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`$template$${ef.label}`] = value;
  });
}
