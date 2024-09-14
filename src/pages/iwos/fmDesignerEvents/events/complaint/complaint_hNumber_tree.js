export const key = 'complaint_hNumber_tree';
export const label = '投诉单_申告地_下拉树';

export default ({vm, item}) => new Promise(async (rs, rj) => {
  if (vm.$store.getters['dictionaries/GET_DICT']('complaint_hNumber_tree')?.length) return rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_hNumber_tree'));
  item.loading = !0;
  const {res, err} = await vm.$$api.crm.getHNumberTree({loading: false, params: {provinceCode: vm.$store.getters['user/GET_USER_PROVINCE_CODE']}});
  item.loading = !1;
  if (err) return rj([]);
  vm.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_hNumber_tree: vm.$$formatCascaderTree((res?.children ? [res] : []), 'name', 'lanid', 'children')});
  rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_hNumber_tree'));
})
