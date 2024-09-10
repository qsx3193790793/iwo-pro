export const key = 'complaint_workorderStrictest_change';
export const label = '投诉单_是否市场最严工单变化';

// 形参value为详情传过来的值
export default async ({vm, value = null}) => {
  console.log('投诉单_是否市场最严工单变化', value)
  const finder = vm.expandFormConfigItems.find(efci => efci.key === 'workorderStrictestScene');
  if (vm.formData.workorderStrictest == '1') {
    finder.isRequire = true;
    return vm.formData.workorderStrictestScene = value?.workorderStrictestScene ?? vm.formData.workorderStrictestScene ?? null;
  }
  finder.isRequire = false;
  vm.formData.workorderStrictestScene = value?.workorderStrictestScene ?? null;
}
