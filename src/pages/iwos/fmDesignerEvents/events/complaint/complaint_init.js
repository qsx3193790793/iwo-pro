export const key = 'complaint_init';
export const label = '投诉单_初始化';

export default async ({vm, item}) => {

  if (!vm.$route.params.workorderId) { // 新建

    const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
    // 未定位直接pass
    if (!customPositioning) return;
    const {lanIdInfo, custom, accType, accNum, callerNo, recordingId, callId} = customPositioning;

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
      // vm.$$api.srv.getUnifyComplaintCode({loading: !1, data: {complaintPhone: accNum, custName: custom.custName}}),
    ]);

    // 工单画像 // 省内接口_设备产品信息查询
    const {res, err} = R1, {res: dciRes, err: dciErr} = R2;//, {res: idRes, err: idErr} = R3;

    if (err || dciErr) return;

    return vm.initFormData({
      // 投诉编码
      'unifiedComplaintCode': +new Date(),// idRes.unifiedComplaintCode,
      // 集团工单编号
      'complaintWorksheetId': +new Date(),// idRes.complaintWorksheetId,

      'lanId': lanIdInfo.lanid ?? null,
      'problemLanId': lanIdInfo.lanid ?? null,

      // 设备产品信息查询  发展渠道
      'developChannel': dciRes?.channelName ?? null,
      'developChannelCode': dciRes?.channelNbr ?? null,
      'controlChannel': dciRes?.controlOrgName ?? null,

      //申诉日期
      'appealDate': vm.$$dateFormatterYMDHMS(vm.$$dayjs()),

      //基本客户信息
      'userStarLevel': custom.custLevel ?? null,
      'upgradeTrend': custom.complaintLevelUp ?? '无',
      'callerNo': custom.callerNo ?? null,
      'recordingId': custom.recordingId ?? null,
      'callId': custom.callId ?? null,
      'contactPhone1': accNum ?? null,
      'phoneLocal': lanIdInfo.oneLevel ?? null,
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
      value: complaintAssistVoList.reduce((t, c) => ((t[`$template$${c.fieldName}`] = c.fieldValue ?? null), t), {})
    });
  }
}
