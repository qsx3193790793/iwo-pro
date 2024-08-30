export const key = "complaint_saveComplaintPhenomMark";
export const label = "投诉单_获取投诉现象";

export default async ({vm, item}) => {
  const formData = vm.getFormData();
  if (!formData.complaintWorksheetId) return;
  const {res, err} = await vm.$$api.complaint.saveComplaintPhenomMark({
    data: {
      complaintWorksheetId: formData.complaintWorksheetId,
      complaintAssetNum: formData.complaintAssetNum,
      complaintInfo: formData.complaintDescription,
    },
  });
  if (err) return;

  vm.initFormData({
    complaintPhenomenonLevel: [res.phenomenonFirstLevelCode, res.phenomenonSecondLevelCode, res.phenomenonThirdLevelCode].filter(v => !!v)
  });
  await vm.expandFormConfigItems.find(efci => efci.key === 'complaintPhenomenonLevel')?.onChange({vm});
};
