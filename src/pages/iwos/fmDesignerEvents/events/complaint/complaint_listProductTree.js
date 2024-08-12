//测试
export const key = 'complaint_listProductTree';
export const label = '投诉单_产品_下拉树';

export default ({vm, item}) => new Promise(async (rs, rj) => {
  if (vm.$store.getters['dictionaries/GET_DICT']('complaint_product_tree')?.length) return rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_product_tree'));
  item.loading = !0;
  const {res, err} = await vm.$$api.productClassification.listProductTree({loading: false});
  item.loading = !1;
  if (err) return rj([]);
  vm.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_product_tree: vm.$$formatCascaderTree((res?.list || []), 'productName', 'productCode', 'children')});
  rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_product_tree'));
})
