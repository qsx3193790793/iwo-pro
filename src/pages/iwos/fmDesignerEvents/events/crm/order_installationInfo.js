export const key = 'order_installationInfo';
export const label = '省内接口_装维信息查询';
export const resFields = [
  {"label": "最近一次装维订单号", "value": "orderId"},
  {"label": "装维人员工号", "value": "staff"},
  {"label": "装维人员姓名", "value": "staffName"},
  {"label": "装维人员联系号码", "value": "contactTel"},
  {"label": "预约上门开始时间", "value": "startDate"},
  {"label": "预约上门结束时间", "value": "endDate"},
  {"label": "状态", "value": "statusCd"},
  {"label": "状态名称", "value": "statusName"},
  {"label": "处理结果", "value": "handleResult"}
];

export default async ({vm, item, eventsFields}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning)
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.installationInfo({
    data: {
      accNum: accNum,//   手机号码
      lanId: lanIdInfo.lanid,//  本地网标识
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(res || {}, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
