
export const key = 'complaint_listComplaintPhenomenonTree';
export const label = '投诉单_投诉现象_下拉树';

export default ({vm, item}) => new Promise(async (rs, rj) => {
  if (vm.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree')?.length) return rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree'));
  item.loading = !0;
  const {res, err} = await vm.$$api.complaintPhenomenon.listComplaintPhenomenonTree({loading: false});
  item.loading = !1;
  if (err) return rj([]);
  vm.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_phenomenon_tree: vm.$$formatCascaderTree(res?.phenomList || [], 'phenomName', 'phenomCode', 'phenomList')});
  rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree'));
})
