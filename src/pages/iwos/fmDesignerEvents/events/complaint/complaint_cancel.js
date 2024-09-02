export const key = "complaint_cancel";
export const label = "投诉单_取消";

export default ({ vm, item }) => {
  vm.$$Dialog.confirm(`此操作会取消工单，是否确认取消？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(()=>{
    const formData = vm.getFormData();
    console.log("complaint_submit", formData);
    const data = {
      workorderId: formData.workorderId,
      statusCd: "C100002",
      complaintWorksheetId: formData.complaintWorksheetId,
    };
    (async function () {
      let { res, err } =
        await vm.$$api.complaint.temporaryCancelComplaintWorkOrder({
          data: data,
        });
      if (err) return vm.$$Toast({ message: `取消失败`, type: "error" });
      return vm.$$Toast({ message: `取消成功`, type: "success" });
    })();
  }).catch(vm.$$emptyFn)
};
