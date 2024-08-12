//测试
export const key = 'crm_ECQryCustBill';
export const label = '服务一致性_账单查询';

export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.ECQryCustBill({
    params: {provinceId: '8310000'},
    data: {
      "billingCycleId": 202407,
      "operAttrStruct": {
        "lanId": 8310100,
        "operOrgId": 11111,
        "staffId": 1111
      },
      "svcObjectStruct": {
        "objValue": "18918950591",
        "objType": "3"
      }
    }
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  console.log(res)
}
