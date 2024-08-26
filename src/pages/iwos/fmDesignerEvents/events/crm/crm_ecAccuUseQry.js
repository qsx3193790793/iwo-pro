
export const key = 'crm_ecAccuUseQry';
export const label = '服务一致性_量本使用查询';
export const resFields =[];

export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.ecAccuUseQry({
    params: {provinceId: '8310000'},
    data: {
      "operAttrStruct": {
        "staffId": 1111,
        "operOrgId": 11111,
        "lanId": "8310000"
      },

      "svcObjectStruct": {
        "objType": "3",
        "objValue": "18918950591",
        "objAttr": "2"
      }
    }
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  console.log(res)
}
