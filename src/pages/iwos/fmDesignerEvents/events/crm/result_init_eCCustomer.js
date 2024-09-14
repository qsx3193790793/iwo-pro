export const key = 'result_init_eCCustomer';
export const label = '服务一致性_客户基本信息结果赋值';
export const resFields = [
  {"label": "客户id", "value": "custId"},
  {"label": "客户编号", "value": "custNumber"},
  {"label": "设备号", "value": "accNumber"},
  {"label": "联系电话", "value": "mobile"},
  {"label": "客户姓名", "value": "custName"},
  {"label": "性别", "value": "gender"},
  {"label": "联系地址", "value": "contactAddress"},
  {"label": "客户地址", "value": "custAddr"},
  {"label": "联系邮箱", "value": "email"},
  {"label": "客户类型", "value": "custType"},
  {"label": "客户类型名称", "value": "custTypeName"},
  {"label": "证件号", "value": "certNum"},
  {"label": "证件类型", "value": "certType"},
  {"label": "邮政编码", "value": "postCode"},
  {"label": "客户星级", "value": "custLevel"},
  {"label": "客户星级名称", "value": "custLevelName"},
  {"label": "入网年份", "value": "netAccess"},
  {"label": "出生年月", "value": "birth"},
  {"label": "客户年龄", "value": "custAge"},
  {"label": "客户网龄", "value": "custNetAge"},
  {"label": "是否重要客户", "value": "isImportant"},
  {"label": "是否关键政企用户", "value": "isGovernment"},
  {"label": "城乡标识", "value": "cityFlag"},
  {"label": "城乡标识名称", "value": "cityFlagName"},
  {"label": "投诉升级意向", "value": "complaintLevelUp"},
  {"label": "省编码", "value": "provinceCode"},
  {"label": "创建人", "value": "createdBy"},
  {"label": "创建时间", "value": "createdTime"},
  {"label": "更新人", "value": "updatedBy"},
  {"label": "更新时间", "value": "updatedTime"}
];
export default async ({vm, item, eventsFields}) => {
  if (!vm.rootParams || vm.formStatus !== 'create') return;
  const {lanIdInfo, accType, accNum, custom} = vm.rootParams;
  vm.$nextTick(() => {
    const fields = (eventsFields || item?.eventsFields || []).filter(ef => ef.value.startsWith(`$${key}$`));
    console.log('event call', key, fields);
    fields.forEach(ef => {
      const valueKey = ef.value.replace(`$${key}$`, '');
      const value = vm.$$lodash.get(custom || {}, valueKey);
      if (vm.$$isEmpty(value)) return;
      vm.formData[`${ef.label}`] = value;
    });
  });
}
