
export const key = 'crm_ecQryBill';
export const label = '服务一致性_欠费查询';
export const resFields =[];
export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.ecQryBill({
    params: {provinceId: '8310000'},
    data: {
      "billQueryType": "2",
      "destinationAccount": "18918950591",
      "destinationAttr": "2",
      "queryFlag": "1",
      "feeQueryFlag": "0",
      "operAttrStruct": {
        "operOrgId": "476970272",
        "staffId": "46019614927",
        "lanId":"8310100"
      }
    }
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  console.log(res)
}
