
export const key = 'complaint_listComplaintSourceTree';
export const label = '投诉单_投诉来源_下拉树';

export default ({vm, item}) => new Promise(async (rs, rj) => {
  if (vm.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid')?.length) return rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid'));
  item.loading = !0;
  const {res, err} = await vm.$$api.complaintSource.getAskSourceSrlByUid({loading: false});
  item.loading = !1;
  if (err) return rj([]);
  vm.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_source_tree_by_uid: vm.$$formatCascaderTree(res?.list || [], 'sourceName', 'sourceCode', 'children')});
  rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid'));//?.[0]?.children || []
})
