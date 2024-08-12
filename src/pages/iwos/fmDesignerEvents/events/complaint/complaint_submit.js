//测试
export const key = 'complaint_submit';
export const label = '投诉单_提交';

export default ({vm, item}) => {
  const formData = vm.getFormData();
  // 发展渠道
  const {path: developChannelPath, pathLabels: developChannelPathLabels} = vm.$refs.complaint$dot$developChannel?.[0]?.getCheckedNodes()?.[0] || {};
  vm.$$lodash.set(formData, 'complaint.developChannel', null);
  vm.$$lodash.set(formData, 'complaint.developChannelCode', null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel1', developChannelPathLabels?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel2', developChannelPathLabels?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel3', developChannelPathLabels?.[2] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel1Code', developChannelPath?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel2Code', developChannelPath?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel3Code', developChannelPath?.[2] ?? null);

  // 投诉现象
  const {path: complaintPhenomenonLevelPath, pathLabels: complaintPhenomenonLevelPathLabels} = vm.$refs.complaint$dot$complaintPhenomenonLevel?.[0]?.getCheckedNodes()?.[0] || {};
  vm.$$lodash.set(formData, 'complaint.complaintPhenomenonLevel1', complaintPhenomenonLevelPathLabels?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.complaintPhenomenonLevel2', complaintPhenomenonLevelPathLabels?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.complaintPhenomenonLevel3', complaintPhenomenonLevelPathLabels?.[2] ?? null);
  vm.$$lodash.set(formData, 'complaint.complaintPhenomenonLevel1Code', complaintPhenomenonLevelPath?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.complaintPhenomenonLevel2Code', complaintPhenomenonLevelPath?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.complaintPhenomenonLevel3Code', complaintPhenomenonLevelPath?.[2] ?? null);

  // 产品
  const {path: productLevelPath, pathLabels: productLevelPathLabels} = vm.$refs.complaint$dot$productLevel?.[0]?.getCheckedNodes()?.[0] || {};
  vm.$$lodash.set(formData, 'complaint.productLevel1', productLevelPathLabels?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.productLevel2', productLevelPathLabels?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.productLevel1Code', productLevelPath?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.productLevel2Code', productLevelPath?.[1] ?? null);

  //投诉来源
  const {path: askSourceSrlPath, pathLabels: askSourceSrlPathLabels} = vm.$refs.complaint$dot$askSourceSrl?.[0]?.getCheckedNodes()?.[0] || {};
  vm.$$lodash.set(formData, 'complaint.askSourceSrl', '1');

  vm.$$lodash.set(formData, 'complaintAssistList', [
    {fieldTitle: '1', fieldName: '2', fieldValue: '3'},
    {fieldTitle: '2', fieldName: '3', fieldValue: '4'},
  ]);

  console.log('complaint_submit', formData, askSourceSrlPath, askSourceSrlPathLabels)
  vm.validator(
    () => {
      vm.$$Dialog.confirm(`你确定要保存吗？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {
        const {res, err} = await vm.$$api.complaint.saveComplaintWorkOrder({data: formData});
        if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
        return vm.$$Toast({message: `操作成功`, type: 'success'});
      }).catch(vm.$$emptyFn);
    }
  );
}
