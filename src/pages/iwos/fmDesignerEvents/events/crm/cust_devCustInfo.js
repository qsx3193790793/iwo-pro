//测试
export const key = 'cust_devCustInfo';
export const label = '省内接口_设备产品信息查询';

export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.devCustInfo({
    data: {
      accNum: '19901842565',
      lanId: "8310100",
    }
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
}
