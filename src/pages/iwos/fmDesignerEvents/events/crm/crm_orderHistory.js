//测试
export const key = 'crm_orderHistory';
export const label = '服务一致性_历史订购查询';

export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.orderHistory({
    params: {
      serialNumber: '18019010053',
      lanId: '8310100',
    },
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  console.log(res)
}
