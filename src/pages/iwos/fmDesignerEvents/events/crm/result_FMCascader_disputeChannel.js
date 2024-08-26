export const key = 'result_FMCascader_disputeChannel';
export const label = '场景字段_级联_争议渠道选择赋值';
export const resFields = [
  {label: '争议渠道一级名称', value: 'pathLabels[0]'},
  {label: '争议渠道二级名称', value: 'pathLabels[1]'},
  {label: '争议渠道三级名称', value: 'pathLabels[2]'},
  {label: '争议渠道名称链', value: 'fullPathLabel'},
  {label: '争议渠道一级编码', value: 'path[0]'},
  {label: '争议渠道二级编码', value: 'path[1]'},
  {label: '争议渠道三级编码', value: 'path[2]'},
  {label: '争议渠道编码链', value: 'fullPath'},
];
export default async ({vm, item, value}) => {
  console.log(vm, item, value)
  item.eventsFields.forEach(ef => {
    const v = vm.$$lodash.get(value || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    vm.formData[`${ef.label}`] = v;
  });
}
