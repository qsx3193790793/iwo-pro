export const key = 'complaint_init';
export const label = '投诉单_初始化';

export default async ({vm, item}) => {
  const customPositioning = vm.$store.getters['storage/GET_STORAGE_BY_KEY']('customPositioning');
  // 未定位直接pass
  if (!customPositioning) return;
  const {lanIdInfo, custom, accType, accNum, callerNo, recordingId, callId} = customPositioning;

  const {res, err} = await vm.$$api.crm.sourceCountUserPicuture({loading: !1});

  vm.initFormData({
    complaint$dot$userStarLevel: custom.custLevel ?? '',
    complaint$dot$upgradeTrend: custom.complaintLevelUp ?? '无',
    complaint$dot$callerNo: custom.callerNo ?? '',
    complaint$dot$recordingId: custom.recordingId ?? '',
    complaint$dot$callId: custom.callId ?? '',
    complaint$dot$contactPhone1: accNum ?? '',
    complaint$dot$phoneLocal: lanIdInfo.oneLevel ?? '',
    complaint$dot$complaintAssetNum: accNum ?? '',

    complaint$dot$recmplntTimes30days: res?.repeatedComplaintsThirtyDays || '-',
    complaint$dot$croscmplntTimes30days: res?.complaintsExceedingLevelThirtyDays || '-',
    complaint$dot$refundRecords90days: res?.ninetyDaysRefundRecord || '-',
    complaint$dot$satisfactionEstima30days: res?.thirtyDaysOrderSatisfied || '-',
    complaint$dot$dissatisfactionEstima30days: res?.thirtyDaysOrderDissatisfied || '-',
  })
}
