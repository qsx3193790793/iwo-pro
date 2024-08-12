//测试
export const key = 'crm_orderInfo';
export const label = '服务一致性_订单信息查询';

export default async ({vm, item}) => {
  const {res, err} = await vm.$$api.crm.orderInfo({
    params: {
      serialNumber: '18019010053',
      lanId: '8310100',
      prodClass: '25',
      beginDate: '2021-07-01',
      endDate: '2021-07-31',
    },
  });
  if (err) return vm.$$Toast({message: `操作失败`, type: 'error'});
  console.log(res)
}
