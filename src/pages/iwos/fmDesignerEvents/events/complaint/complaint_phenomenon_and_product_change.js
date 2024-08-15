import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config";

export const key = 'complaint_phenomenon_and_product_change';
export const label = '投诉单_投诉现象及产品变化拉取模板';

//清除模板
function clearTemplate(vm) {
  Object.keys(vm.formData).forEach(key => key.startsWith('$template$') && delete vm.formData[key]);
}

export default async ({vm, item}) => {
  const complaintPhenomenonLevel = vm.formData.complaint$dot$complaintPhenomenonLevel?.[vm.formData.complaint$dot$complaintPhenomenonLevel.length - 1];
  const productLevel = vm.formData.complaint$dot$productLevel?.[vm.formData.complaint$dot$productLevel.length - 1];
  if (complaintPhenomenonLevel) {//必须要有现象 通过 (现象:产品) 进行查询
    const sceneCode = [complaintPhenomenonLevel, productLevel].filter(v => !!v).join(':');
    // const formModel = parseFormModel(testT);
    // 将模板key和其他表单区分开 把key加个$template$
    const {res, err} = await vm.$$api.template.formMock({loading: false, sceneCode, templateType: '0'});
    if (res) {
      const formModel = parseFormModel(JSON.parse(res.formContent));
      console.log('vm.formConfig.appendItems', res, formModel)
      vm.formData.verbalTrickContent = res.verbalTrickContent || '';
      vm.formConfig.appendItems = formModel.items.map(it => (it.items.forEach(itt => itt.key = `$template$${itt.key}`), it));
      formModel?.onLoad({vm});
      console.log('vm.formConfig.appendItems', vm.formConfig.appendItems);
      return;
    }
  }
  vm.formConfig.appendItems = [];//失败
}
