export const key = 'complaint_listChannelTree';
export const label = '投诉单_发展渠道_下拉树';

export default ({vm, item}) => new Promise(async (rs, rj) => {
  if (vm.$store.getters['dictionaries/GET_DICT']('complaint_channel_tree')?.length) return rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_channel_tree'));
  item.loading = !0;
  const {res, err} = await vm.$$api.channelClassification.listChannelTree({loading: false, params: {status: 1}});
  item.loading = !1;
  if (err) return rj([]);
  vm.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_channel_tree: vm.$$formatCascaderTree((res?.list || []), 'channelName', 'channelCode', 'children')});
  rs(vm.$store.getters['dictionaries/GET_DICT']('complaint_channel_tree'));
})
