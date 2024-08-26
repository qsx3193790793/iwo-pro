
export const key = 'histryfaultOrder_queryHistryfaultOrder';
export const label = '省内接口_故障历史查询';
export const resFields = [
  {"label": "30天内故障次数", "value": "accNum"},
  {"label": "最近1次故障单号", "value": "faultOrderId"},
  {"label": "最近1次故障处理结果", "value": "faultHandleRes"},
  {"label": "问题所在地址", "value": "faultAddr"},
  {"label": "经度", "value": "faultLatitude"},
  {"label": "纬度", "value": "faultLongitude"},
  {"label": "故障现象", "value": "reasonDesc"},
  {"label": "是否出现群障", "value": "isGroupFault"},
  {"label": "故障时间", "value": "faultDate"}
];
export default async ({vm, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.queryHistryfaultOrder({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  console.log('eventsFields', eventsFields)
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  eventsFields.forEach(ef => {
    const value = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
