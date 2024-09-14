export const key = "complaint_completed";
export const label = "投诉单_办结";

export default ({vm, item}) => {
  const formData = vm.getFormData();
  console.log("complaint_submit", formData);
  const data = {
    msgId:
      formData.lanId +
      "-" +
      vm.$$dayjs().format("YYYYMMDDHHmmss") +
      "-123456",
    timestamp: new Date().getTime(),
    para: {
      unifiedComplaintCode: formData.unifiedComplaintCode,
      distributionDate: "2024-07-31 15:45:00",
      // 办结时间
      worksheetFinishTime: vm.$$dayjs().format("YYYY-MM-DD HH:mm:ss"),
      isOvertime: 0,
      complaintInfo: formData.complaintInfo,
      complaintPhenomenonType: 1,
      complaintPhenomenonName: "移动业务-业务生效",
      custType: "1100",
      netAge: 24,
      comment: "Additional comments...",
      contactPeople: formData.appealUserName,
      contactPhone: formData.complaintAssetNum,
      dealLimitTime: "5",
      fristResponseTime: "2024-07-31 11:00:00",
      isAccept: "是",
      dealPerson: "JaneSmith",
      dealResult: "Resolved",
      dealResulCust: "Customer satisfied",
      dealComment: "Issue resolved promptly.",
      dealTime: "2024-07-31 16:00:00",
      complaintReasonType: "70102",
      complaintReasonName: "移动业务-费用争议",
      responsibilityReason: "Internal server maintenance",
      auditPerson: "Emily Brown",
      auditResult: "Y",
      isAudit: "是",
      auditComment: "Validated customer complaint.",
      isPayReturn: "是",
      payreturnTime: "2024-07-31 16:00:00",
      payreturnComment: "1231",
      payreturnRecordingId: "123123",
      isresultOk: "0",
      processingTime: 12,
    },
  };
  (async function () {
    let {res, err} =
      await vm.$$api.complaint.temporaryCompletedComplaintWorkOrder({
        data: data,
      });
    // if (err) return vm.$$Toast({ message: `办结失败`, type: "error" });
    if (res) {
      vm.$$Toast({message: `办结成功`, type: "success"});
      return vm.$store.commit('storage/REMOVE_TAB', vm.$route.query.tabId);
    }
  })();
};
