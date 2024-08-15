export const key = 'complaint_btn_formatVerbalTrickContent';
export const label = '投诉单_按钮_投诉内容模板化';

export default ({vm, item}) => {
  if (!vm.formData.verbalTrickContent) return vm.$$Toast({message: `未获取到模板，请先选择投诉现象`, type: 'error'});
  let verbalTrickContent = vm.formData.verbalTrickContent;
  const matches = vm.formData.verbalTrickContent.match(/\{\{.*?\}\}/g);
  matches?.forEach(key => {
    const rk = key.replace(/[\{\}]/g, '');
    verbalTrickContent = verbalTrickContent.replace(key, vm.formData[`$template$${rk}`] ?? '');
  });
  vm.formData['complaint$dot$complaintInfo'] = verbalTrickContent;
}
