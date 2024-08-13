export const key = 'complaint_init';
export const label = '投诉单_初始化';

export default async ({vm, item}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum, callerNo, recordingId, callId} = customPositioning;

  // 工单画像
  const {res, err} = await vm.$$api.crm.sourceCountUserPicuture({loading: !1});
  // 省内接口_设备产品信息查询
  const {res: dciRes, err: dciErr} = await vm.$$api.crm.devCustInfo({loading: !1, data: {accNum, lanId: lanIdInfo.lanid}});

  vm.initFormData({
    'complaint': {
      // 投诉编码
      'unifiedComplaintCode': `${+new Date()}`,

      // 设备产品信息查询  发展渠道
      'developChannel': dciRes?.channelName ?? '',
      'developChannelCode': dciRes?.channelNbr ?? '',
      'controlChannel': dciRes?.controlOrgName ?? '',

      //申诉日期
      'appealDateStr': vm.$$dateFormatterYMDHMS(vm.$$dayjs()),

      //基本客户信息
      'userStarLevel': custom.custLevel ?? '',
      'upgradeTrend': custom.complaintLevelUp ?? '无',
      'callerNo': custom.callerNo ?? '',
      'recordingId': custom.recordingId ?? '',
      'callId': custom.callId ?? '',
      'contactPhone1': accNum ?? '',
      'phoneLocal': lanIdInfo.oneLevel ?? '',
      'complaintAssetNum': accNum ?? '',
      'appealUserName': custom.custName ?? '',
      'custName': custom.custName ?? '',

      //工单画像
      'recmplntTimes30days': res?.repeatedComplaintsThirtyDays || '-',
      'croscmplntTimes30days': res?.complaintsExceedingLevelThirtyDays || '-',
      'refundRecords90days': res?.ninetyDaysRefundRecord || '-',
      'satisfactionEstima30days': res?.thirtyDaysOrderSatisfied || '-',
      'dissatisfactionEstima30days': res?.thirtyDaysOrderDissatisfied || '-',
    }
  })
}
