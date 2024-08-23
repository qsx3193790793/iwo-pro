import {getTypePrefix} from "@/pages/iwos/views/layout/views/system/template/config";

export const key = 'complaint_init';
export const label = '投诉单_初始化';

export default async ({vm, item}) => {

  if (!vm.$route.params.workorderId) { // 新建

    const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
    // 未定位直接pass
    if (!customPositioning) return;
    const {lanIdInfo, custom, accType, accNum, redirectInfo} = customPositioning;

    //查询是否有在途单
    const {res: qpRes} = await vm.$$api.complaint.queryPendingWorkOrderByAssetNum({params: {assetNum: accNum}});
    if (qpRes?.pendingWorkOrderFlag >= 1) {
      const c = await vm.$$Dialog.confirm('该设备号存在在途工单，是否继续新建？', '提示').catch(vm.$$emptyFn);
      if (c !== 'confirm') return;
    }

    vm.formConfig.appendItems = [];//清除模板

    const [R1, R2, R3] = await Promise.all([
      // 工单画像
      vm.$$api.crm.sourceCountUserPicuture({loading: !1}),
      // 省内接口_设备产品信息查询
      vm.$$api.crm.devCustInfo({loading: !1, data: {accNum, lanId: lanIdInfo.lanid}}),
      //获取统一投诉编码和集团工单编号
      vm.$$api.srv.getUnifyComplaintCode({loading: !1, data: {complaintPhone: accNum, custName: custom.custName}}),
    ]);

    // 工单画像 // 省内接口_设备产品信息查询
    const {res, err} = R1, {res: dciRes, err: dciErr} = R2, {res: idRes, err: idErr} = R3;

    if (err || dciErr || idErr) return;

    vm.initFormData({
      // 投诉编码
      'unifiedComplaintCode': idRes.unifiedComplaintCode,
      // 集团工单编号
      'complaintWorksheetId': idRes.complaintWorksheetId,

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
      'problemLanId': lanIdInfo.lanid ?? null,

      //基本客户信息
      'userStarLevel': custom.custLevel ?? null,
      'upgradeTrend': custom.complaintLevelUp ?? '无',
      'contactPhone1': accNum ?? null,
      'phoneLocal': lanIdInfo.twoLevel ?? null,
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

  // 详情
  const {res, err} = await vm.$$api.complaint.complaintWorkOrderDetail({loading: !1, workorderId: vm.$route.params.workorderId});
  if (res) {
    const complaintExtVo = res.complaintExtVo || null, complaintAssistVoList = res.complaintAssistVoList || [];
    delete res.complaintExtVo;
    delete res.complaintAssistVoList;
    vm.initFormData(Object.assign({}, res, {
      complaintPhenomenonLevel: [res.complaintPhenomenonLevel1Code, res.complaintPhenomenonLevel2Code, res.complaintPhenomenonLevel3Code].filter(v => !!v),
      developChannelLevel: [res.developChannelLevel1Code, res.developChannelLevel2Code, res.developChannelLevel3Code].filter(v => !!v),
      productLevel: [res.productLevel1Code, res.productLevel2Code].filter(v => !!v),
    }));
    vm.$emit('onFormLoaded', vm.getFormData());
    await vm.expandFormConfigItems.find(efci => efci.key === 'complaintPhenomenonLevel')?.onChange({
      vm,
      value: complaintAssistVoList.reduce((t, c) => ((t[`${c.fieldType == '0' ? '' : getTypePrefix(c.fieldType || '1')}${c.fieldName}`] = c.fieldValue ?? null), t), {})
    });
    vm.expandFormConfigItems.find(efci => efci.key === 'workorderStrictest')?.onChange({vm, value: {workorderStrictestScene: vm.formData.workorderStrictestScene}});
  }
}
