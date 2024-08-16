//测试

export const key = 'complaint_submit';
export const label = '投诉单_提交';

export default ({vm, item}) => {
  const formData = vm.getFormData();
  // 发展渠道
  const {path: developChannelLevelPath, pathLabels: developChannelLevelPathLabels} = vm.$refs.complaint$dot$developChannelLevel?.[0]?.getCheckedNodes()?.[0] || {};
  // vm.$$lodash.set(formData, 'complaint.developChannel', null);
  // vm.$$lodash.set(formData, 'complaint.developChannelCode', null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel1', developChannelLevelPathLabels?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel2', developChannelLevelPathLabels?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel3', developChannelLevelPathLabels?.[2] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel1Code', developChannelLevelPath?.[0] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel2Code', developChannelLevelPath?.[1] ?? null);
  vm.$$lodash.set(formData, 'complaint.developChannelLevel3Code', developChannelLevelPath?.[2] ?? null);

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
  const {path: askSourceSrlChainPath, pathLabels: askSourceSrlChainPathLabels} = vm.$refs.complaint$dot$askSourceSrlChain?.[0]?.getCheckedNodes()?.[0] || {};
  vm.$$lodash.set(formData, 'complaint.askSourceSrl', askSourceSrlChainPath?.[askSourceSrlChainPath?.length - 1] ?? null);

  //省内建单时间
  vm.$$lodash.set(formData, 'complaint.provinceOrderCreateTime', vm.$$dateFormatterYMDHMS(vm.$$dayjs()));

  //场景字段
  vm.$$lodash.set(formData, 'complaintAssistList', vm.expandFormConfigItems.filter(efci => efci.key?.startsWith('$template$')).map(efci => ({
    fieldTitle: efci.name, fieldName: efci.key.replace('$template$', ''), fieldValue: formData[efci.key] ?? null
  })));

  console.log('complaint_submit', formData)
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
