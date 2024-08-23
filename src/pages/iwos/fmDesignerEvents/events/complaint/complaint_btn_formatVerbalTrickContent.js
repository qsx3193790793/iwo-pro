export const key = 'complaint_btn_formatVerbalTrickContent';
export const label = '投诉单_按钮_投诉内容模板化';

export default ({vm, item}) => {
  const formData = vm.getFormData();
  if (!formData.verbalTrickContent) return vm.$$Toast({message: `未获取到模板，请先选择投诉现象`, type: 'error'});
  let verbalTrickContent = formData.verbalTrickContent;
  const matches = formData.verbalTrickContent.match(/\{\{.*?\}\}/g);
  matches?.forEach(key => {
    const rk = key.replace(/[\{\}]/g, '');
    if (rk.startsWith('$public$')) {
      verbalTrickContent = verbalTrickContent.replace(key, vm.$$lodash.get(formData, `${rk.replace('$public$', ``)}`) ?? '');
      return;
    }
    verbalTrickContent = verbalTrickContent.replace(key, formData[`${rk}`] ?? '');
  });
  vm.formData['complaintInfo'] = verbalTrickContent;
}
