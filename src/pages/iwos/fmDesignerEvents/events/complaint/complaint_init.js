import {getTypePrefix} from "@/pages/iwos/views/layout/views/system/template/config";
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config";

export const key = 'complaint_init';
export const label = '投诉单_初始化';

export default async ({vm, item}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');

  if (!vm.$route.params.workorderId && !vm.$route.params.detailWorkorderId) { // 新建
    const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');

    // 未定位直接pass
    if (!customPositioning) return;
    const {lanIdInfo, custom, complaintWorksheetId, accNum, redirectInfo, eCProductInfo} = customPositioning;

    if (lanIdInfo?.lanid) {
      //申告地
      vm.$$api.crm.getHNumberTree({loading: false, params: {provinceCode: vm.$store.getters['user/GET_USER_PROVINCE_CODE']}}).then(({res, err}) => {
        const tree = vm.$$formatCascaderTree((res?.children ? [res] : []), 'name', 'lanid', 'children');
        vm.expandFormConfigItems.find(efci => efci.key === 'problemLanIdChain').options = tree;
        vm.formData.problemLanIdChain = vm.$$findTreePath({tree, value: lanIdInfo.lanid});
      });
    }

    vm.removeAppendItems(['complaint_scene_form']);//清除模板

    // 工单类型：投诉单：BUS0001，查询单：BUS0002
    // 模板大类：建单模板：TPL0001，结案模板：TPL0002
    // 模板小类：投诉现象：TPL0100，投诉来源：TPL0101，通用模板：TPL0102

    const [R1, R2, R3, R4] = await Promise.allSettled([
      // 工单画像
      vm.$$api.crm.sourceCountUserPicuture({
        isErrDialog: !1, loading: !1,
        headers: {'complaintWorksheetId': complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
      }),
      // 省内接口_设备产品信息查询
      vm.$$api.crm.devCustInfo({
        isErrDialog: !1, loading: !1, data: {accNum, lanId: lanIdInfo.lanid},
        headers: {'complaintWorksheetId': complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
      }),
      //获取统一投诉编码
      vm.$$api.srv.getUnifyComplaintCode({
        isErrDialog: !1, loading: !1, data: {complaintPhone: accNum, custName: custom.custName, complaintWorksheetId},
        headers: {'complaintWorksheetId': complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
      }),
      // 拉取通用模板
      (process.env.VUE_APP_TEMPLATE_FORM_IS_MOCK === 'true' ? vm.$$api.template.formMock : vm.$$api.complaint.formCommon)({
        isErrDialog: !1, loading: false, sceneCode: ['BUS0001', 'TPL0001', 'TPL0102'].join(':'), bigType: 'TPL0001', workorderType: 'BUS0001',
        headers: {'complaintWorksheetId': complaintWorksheetId ?? '', 'complaintAssetNum': accNum ?? ''}
      }),
    ]);

    // 工单画像 // 省内接口_设备产品信息查询
    console.log(R1, R2, R3, R4);
    const {res, err} = R1, {res: dciRes, err: dciErr} = R2.value, {res: idRes, err: idErr} = R3.value, {res: pbtRes, err: pbtErr} = R4.value;

    if (idErr) return vm.$$Dialog.confirm('统一投诉编码获取失败', '提示', {showCancelButton: false}).catch(vm.$$emptyFn);

    //通用模板 sort在第一板块之后 0.1 .... 不到1
    if (pbtRes?.formContent) {
      const provinceCommFormModel = parseFormModel(JSON.parse(pbtRes.formContent));
      vm.setAppendItems([{key: 'complaint_province_comm_form', items: provinceCommFormModel.items.map((it, i) => ((it.sort = (0.1 * i)), it))}]);
    }

    vm.initFormData({
      // 投诉编码
      'unifiedComplaintCode': idRes.unifiedComplaintCode,
      // 集团工单编号
      'complaintWorksheetId': complaintWorksheetId,

      //来源默认省内投诉-10000号语音
      'askSourceSrlChain': vm.$$findTreePath({tree: vm.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid'), value: 'C10001'}),

      // 设备产品信息查询  发展渠道
      'developChannel': dciRes?.channelName ?? null,
      'developChannelCode': dciRes?.channelNbr ?? null,
      'controlChannel': dciRes?.controlOrgName ?? null,

      //主叫号码 呼叫流水
      'callerNo': redirectInfo?.callerNum ?? null,
      'callId': redirectInfo?.callId ?? null,
      //现象 产品 渠道
      'complaintPhenomenonLevel': [redirectInfo?.phenomenonLevel1Code, redirectInfo?.phenomenonLevel2Code, redirectInfo?.phenomenonLevel3Code].filter(v => !!v),
      'productLevel': [redirectInfo?.prodLevel1Code, redirectInfo?.prodLevel2Code, redirectInfo?.prodLevel3Code].filter(v => !!v),
      'developChannelLevel': [redirectInfo?.channelLevel1Code, redirectInfo?.channelLevel2Code, redirectInfo?.channelLevel3Code].filter(v => !!v),

      //申诉日期
      'appealDate': vm.$$dateFormatterYMDHMS(vm.$$dayjs()),

      // 归属地信息
      'lanId': lanIdInfo.lanid ?? null,
      'phoneLocal': eCProductInfo?.phoneLocal ?? null,

      //基本客户信息
      'userStarLevel': custom.custLevel ?? null,
      'upgradeTrend': custom.complaintLevelUp ?? '无',
      'contactPhone1': accNum ?? null,
      'complaintAssetNum': accNum ?? null,
      'appealUserName': custom.custName ?? null,
      'custName': custom.custName ?? null,
      'netAge': custom.m_netAge ?? null,
      'importantCustomer': ({'是': '1', '否': '0'})[custom.isImportant] ?? null,
      'custAge': custom.custAge ?? null,
      'cityFlag': custom.cityFlag ?? null,
      'governmentEnterprisekeyPerson': ({'是': '1', '否': '0'})[custom.isGovernment] ?? null,
      'custType': custom.custType ?? null,

      //工单画像
      'recmplntTimes30days': res?.repeatedComplaintsThirtyDays ?? null,
      'croscmplntTimes30days': res?.complaintsExceedingLevelThirtyDays ?? null,
      'refundRecords90days': res?.ninetyDaysRefundRecord ?? null,
      'satisfactionEstima30days': res?.thirtyDaysOrderSatisfied ?? null,
      'dissatisfactionEstima30days': res?.thirtyDaysOrderDissatisfied ?? null,
    });

    //触发现象事件
    if (vm.formData.complaintPhenomenonLevel?.length) vm.expandFormConfigItems.find(efci => efci.key === 'complaintPhenomenonLevel')?.onChange({vm});
    return;
  }

  //以下 详情进入
  const [R1, R2] = await Promise.all([
    vm.$$api.complaint.complaintWorkOrderDetail({
      loading: !1, workorderId: vm.$route.params.workorderId || vm.$route.params.detailWorkorderId,//详情和新建分开 避免keepalive污染
      headers: {'complaintWorksheetId': vm.$route.query.complaintWorksheetId ?? '', 'complaintAssetNum': vm.$route.query.complaintAssetNum ?? ''}
    }),
    // 拉取通用模板
    (process.env.VUE_APP_TEMPLATE_FORM_IS_MOCK === 'true' ? vm.$$api.template.formMock : vm.$$api.complaint.formCommon)({
      loading: false, sceneCode: ['BUS0001', 'TPL0001', 'TPL0102'].join(':'), bigType: 'TPL0001', workorderType: 'BUS0001',
      headers: {'complaintWorksheetId': vm.$route.query.complaintWorksheetId ?? '', 'complaintAssetNum': vm.$route.query.complaintAssetNum ?? ''}
    }),
  ]);

  const {res, err} = R1, {res: pbtRes, err: pbtErr} = R2;

  if (res) {
    //申告地
    const problemLanIdChainFinder = vm.expandFormConfigItems.find(efci => efci.key === 'problemLanIdChain');
    problemLanIdChainFinder && vm.$$api.crm.getHNumberTree({loading: false, params: {provinceCode: res.lanId}}).then(({res, err}) => {
      problemLanIdChainFinder.options = vm.$$formatCascaderTree((res?.children ? [res] : []), 'name', 'lanid', 'children');
    });

    //当unifiedComplaintCode为空时 获取统一投诉编码  为了导入用 导入时没有unifiedComplaintCode所以帮他获取下
    let unifiedComplaintCode = res.unifiedComplaintCode ?? null;
    if (!unifiedComplaintCode) vm.$$api.srv.getUnifyComplaintCode({
      loading: !1, data: {complaintPhone: res.complaintAssetNum, custName: res.custName, complaintWorksheetId: res.complaintWorksheetId},
      headers: {'complaintWorksheetId': res.complaintWorksheetId ?? '', 'complaintAssetNum': res.complaintAssetNum ?? ''}
    }).then(({res: ufcRes, err: ufcErr}) => {
      unifiedComplaintCode = ufcRes?.unifiedComplaintCode ?? null;
    });

    if (pbtRes?.formContent) {
      const provinceCommFormModel = parseFormModel(JSON.parse(pbtRes.formContent));
      vm.setAppendItems([{key: 'complaint_province_comm_form', items: provinceCommFormModel.items.map((it, i) => ((it.sort = (0.1 * i)), it))}]);
    }

    const complaintExtVo = res.complaintExtVo || null, complaintAssistVoList = res.complaintAssistVoList || [];
    delete res.complaintExtVo;
    delete res.complaintAssistVoList;
    vm.initFormData(Object.assign({}, res, {
      unifiedComplaintCode,
      complaintPhenomenonLevel: [res.complaintPhenomenonLevel1Code, res.complaintPhenomenonLevel2Code, res.complaintPhenomenonLevel3Code].filter(v => !!v),
      developChannelLevel: [res.developChannelLevel1Code, res.developChannelLevel2Code, res.developChannelLevel3Code].filter(v => !!v),
      productLevel: [res.productLevel1Code, res.productLevel2Code].filter(v => !!v),
    }));
    const complaintAssistVoListValue = complaintAssistVoList.reduce((t, c) => ((t[`${c.fieldType == '0' ? '' : getTypePrefix(c.fieldType)}${c.fieldName}`] = c.fieldValue ?? null), t), {});
    await vm.expandFormConfigItems.find(efci => efci.key === 'complaintPhenomenonLevel')?.onChange({vm, value: complaintAssistVoListValue});
    await vm.expandFormConfigItems.find(efci => efci.key === 'askSourceSrlChain')?.onChange({vm, value: complaintAssistVoListValue});
    vm.expandFormConfigItems.find(efci => efci.key === 'workorderStrictest')?.onChange({vm, value: {workorderStrictestScene: vm.formData.workorderStrictestScene}});
    vm.$emit('onFormLoaded', vm, vm.getFormData());
  }
}
