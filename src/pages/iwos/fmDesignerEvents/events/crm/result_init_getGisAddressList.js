//测试
export const key = 'result_init_getGisAddressList';
export const label = '服务一致性_GIS地址列表结果赋值';
export const resFields = [
  {"label": "地址", "value": "address"},
  {"label": "名称", "value": "name"},
  {"label": "经度", "value": "lng"},
  {"label": "纬度", "value": "lat"}
];
export default async ({vm, item, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  // const {res, err} = await vm.$$api.crm.ECQueryBalance({
  //   params: {provinceId: lanIdInfo.provinceCode},
  //   data: {
  //     "operAttrStruct": {
  //       "staffId": 1111,
  //       "operOrgId": 11111,
  //       "lanId": lanIdInfo.lanid,
  //     },
  //     "svcObjectStruct": {
  //       "objType": "3",
  //       "objValue": accNum,
  //       // accType 移动手机12  宽带11  固话10
  //       // objAttr 移动手机2   宽带3   固话0
  //       "objAttr": ({'12': '2', '11': '3', '10': '0'})[accType],
  //     }
  //   }
  // });
  console.log('eventsFields', vm, item.eventsFields)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
