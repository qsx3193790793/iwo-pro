export const key = 'crm_offer';
export const label = '服务一致性_销售品信息查询';
export const resFields = [
  {"label": "销售品分类", "value": "offerType"},
  {"label": "销售品名称", "value": "offerName"},
  {"label": "销售品编码", "value": "offerNbr"},
  {"label": "销售品系统编码", "value": "extOfferId"},
  {"label": "生效时间", "value": "effDate"},
  {"label": "失效时间", "value": "expDate"},
  {"label": "创建时间", "value": "createDate"},
  {"label": "状态", "value": "statusCd"},
  {"label": "状态时间", "value": "statusDate"},
  {"label": "销售品描述", "value": "offerDesc"},
  {"label": "付费模式", "value": "paymentModeCd"},
  // { "label": "销售品产品关系", "value": "offerProdRels" }
  // { "label": "销售品编码", "value": "offerProdRels[0].offerNbr" },
  // { "label": "产品编码", "value": "offerProdRels[0].prodNbr" },
  // { "label": "关系类型", "value": "offerProdRels[0].relType" },
  // { "label": "角色编码", "value": "offerProdRels[0].roleCd" },
  // { "label": "销售品产品关系约束配置", "value": "offerProdRels[0].offerProdRelRstrCfgs" }
  // { "label": "最小数量", "value": "offerProdRels[0].offerProdRelRstrCfgs[0].minNum" },
  // { "label": "最大数量", "value": "offerProdRels[0].offerProdRelRstrCfgs[0].maxNum" }
];
export default async ({vm, item, eventsFields, value}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  console.log('customPositioning', customPositioning, item, value);
  // 未定位直接pass
  if (!customPositioning || vm.formStatus !== 'create') return;
  const {lanIdInfo, custom, accType, accNum} = customPositioning;
  const {res, err} = await vm.$$api.crm.offer({
    params: {
      offerNbr: value.offerNbr,
      provinceId: lanIdInfo.lanid,
      prodClass: accType,
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
  });
  // 模板会字段统一会有前缀用来区分  '0': 'public' '1': 'scene'  '2': 'ext'  '3': 'comm'
  const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
  console.log('event call', key, fields);
  fields.forEach(ef => {
    const valueKey = ef.value.replace(`$${key}$`, '');
    const value = vm.$$lodash.get(res?.[0] || {}, valueKey);
    if (vm.$$isEmpty(value)) return;
    vm.formData[`${ef.label}`] = value;
  });
}
