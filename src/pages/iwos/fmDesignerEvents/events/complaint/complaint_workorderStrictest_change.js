export const key = 'complaint_workorderStrictest_change';
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
  const [level1, level2] = vm.formData.complaintPhenomenonLevel || [];
  const workorderStrictestScene = phenomenon2StrictestMap[level2] || phenomenon2StrictestMap[level1];
  if (workorderStrictestScene) {
    vm.formData.workorderStrictest = '1';//市场最严工单
    vm.formData.workorderStrictestScene = workorderStrictestScene;//市场最严工单场景
  } else {
    vm.formData.workorderStrictest = '0';//市场最严工单
    vm.formData.workorderStrictestScene = null;//市场最严工单场景
  }

  //必须要有现象 通过 (现象:产品) 进行查询场景模板
  if (complaintPhenomenonLevel) {
    const sceneCode = [complaintPhenomenonLevel, productLevel].filter(v => !!v).join(':');
    // const formModel = parseFormModel(testT);
    // 将模板key和其他表单区分开 把key加个$template$
    const {res, err} = await vm.$$api.template.formMock({loading: false, sceneCode, templateType: '0'});
    if (res?.formContent) {
      const formModel = parseFormModel(JSON.parse(res.formContent));
      vm.formData.verbalTrickContent = res.verbalTrickContent || '';
      vm.formConfig.appendItems = formModel.items.map(it => (it.items.forEach(itt => itt.key = `$template$${itt.key}`), it));
      value && vm.$nextTick(() => vm.initFormData(value));//若详情有值才会赋值操作
      formModel?.onLoad({vm});
      return;
    }
  }
  vm.formConfig.appendItems = [];//失败
}
