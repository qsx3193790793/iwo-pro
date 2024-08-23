import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config";

export const key = 'complaint_phenomenon_and_product_change';
export const label = '投诉单_投诉现象及产品变化拉取模板';

const phenomenon2StrictestMap = {
  '104': '费用争议',
  '10802': '靓号低消',
  '10601': '销户退网', '10602': '业务退订', '10603': '套餐变更',
  '111': '携号转网',
  '11101': '携号转网', '11102': '携号转网', '11103': '携号转网',
  '11104': '携号转网', '11105': '携号转网', '11106': '携号转网',
};

// 形参value为详情传过来的值
export default async ({vm, value = null}) => {
  const complaintPhenomenonLevel = vm.formData.complaintPhenomenonLevel?.[vm.formData.complaintPhenomenonLevel.length - 1];
  const productLevel = vm.formData.productLevel?.[vm.formData.productLevel.length - 1];

  //市场最严工单场景 逻辑
  if (!value) {//详情不触发
    const [level1, level2] = vm.formData.complaintPhenomenonLevel || [];
    const workorderStrictestScene = phenomenon2StrictestMap[level2] || phenomenon2StrictestMap[level1];
    const finder_workorderStrictest = vm.expandFormConfigItems.find(efci => efci.key === 'workorderStrictest');
    if (workorderStrictestScene) {
      vm.formData.workorderStrictest = '1';//市场最严工单
      vm.formData.workorderStrictestScene = workorderStrictestScene;//市场最严工单场景
    } else {
      vm.formData.workorderStrictest = '0';//市场最严工单
      vm.formData.workorderStrictestScene = null;//市场最严工单场景
    }
    finder_workorderStrictest?.onChange({vm, value: {workorderStrictestScene: vm.formData.workorderStrictestScene}});
  }

  //必须要有现象 通过 (现象:产品) 进行查询场景模板
  if (complaintPhenomenonLevel) {
    const sceneCode = [complaintPhenomenonLevel, productLevel].filter(v => !!v).join(':');
    // const formModel = parseFormModel(testT);
    const {res, err} = await vm.$$api.template.formMock({loading: false, sceneCode, bigType: 'TPL0001', workorderType: 'BUS0001'});
    if (res?.formContent) {
      const formModel = parseFormModel(JSON.parse(res.formContent));
      vm.formData.verbalTrickContent = res.verbalTrickContent || '';
      vm.formConfig.appendItems = formModel.items.map(it => (it.items.forEach(itt => itt.key = `${itt.key}`), it));
      //若详情有值才会赋值操作 否则onload
      value ? vm.$nextTick(() => vm.initFormData(value)) : await formModel?.onLoad({vm});
      return;
    }
  }
  vm.formConfig.appendItems = [];//失败
}
