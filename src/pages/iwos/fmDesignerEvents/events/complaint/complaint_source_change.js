import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config";

export const key = 'complaint_source_change';
export const label = '投诉单_投诉来源变化拉取模板';
// 工单类型：投诉单：BUS0001，查询单：BUS0002
// 模板大类：建单模板：TPL0001，结案模板：TPL0002
// 模板小类：投诉现象：TPL0100，投诉来源：TPL0101，通用模板：TPL0102

// 形参value为详情传过来的值
export default async ({vm, value = null}) => {
  const askSourceSrlChain = vm.formData.askSourceSrlChain?.[vm.formData.askSourceSrlChain.length - 1];

  //必须要有现象 通过 (工单类型:大类:小类:来源) 进行查询场景模板
  if (askSourceSrlChain) {
    const sceneCode = ['BUS0001', 'TPL0001', 'TPL0101', askSourceSrlChain].filter(v => !!v).join(':');
    // const formModel = parseFormModel(testT);
    const {res, err} = await vm.$$api.template[process.env.VUE_APP_TEMPLATE_FORM_IS_MOCK ? 'formMock' : 'form']({
      loading: false, sceneCode, bigType: 'TPL0001', workorderType: 'BUS0001',
      headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': vm.formData.complaintAssetNum ?? ''}
    });
    if (res?.formContent) {
      vm.removeAppendItems(['complaint_source_form']);
      const formModel = parseFormModel(JSON.parse(res.formContent));
      vm.setAppendItems([{key: 'complaint_source_form', items: formModel.items.map((it, i) => ((it.sort = (50 + i)), it))}]);//排序到倒数第二
      // vm.formConfig.appendItems = formModel.items; //.map(it => (it.items.forEach(itt => itt.key = `${itt.key}`), it));
      //若详情有值才会赋值操作 否则onload
      value ? vm.$nextTick(() => vm.initFormData(value)) : await formModel?.onLoad({vm});
      return;
    }
  }
  vm.removeAppendItems(['complaint_source_form']);//失败
}
