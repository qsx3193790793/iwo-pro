//测试
export const key = 'result_FMCascader_disputeChannel';
export const label = '场景字段_级联_争议渠道选择赋值';
export const resFields = [
  {label: '争议渠道一级', value: 'pathLabels[0]'},
  {label: '争议渠道二级', value: 'pathLabels[1]'},
  {label: '争议渠道三级', value: 'pathLabels[2]'},
  {label: '争议渠道一级编码', value: 'path[0]'},
  {label: '争议渠道二级编码', value: 'path[1]'},
  {label: '争议渠道三级编码', value: 'path[2]'},
];
export default async ({vm, item, value}) => {

  const getCheckedNodes = vm.$refs[item.key]?.[0].getCheckedNodes()?.[0];
  if (!getCheckedNodes) return;
  console.log(vm, item, getCheckedNodes)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(getCheckedNodes || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`$template$${ef.label}`] = v;
  });
}
