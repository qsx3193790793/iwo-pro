
export const key = 'crm_funcationalProduct';
export const label = '服务一致性_功能产品查询';
export const resFields =[];
export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.funcationalProduct({
    params: {
      serialNumber: '19921594353',
      lanId: '8310100',
      prodClass: 'accType',
    },
    headers: {'complaintWorksheetId': vm.formData.complaintWorksheetId ?? '', 'complaintAssetNum': '' ?? ''}
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  console.log(res)
}
