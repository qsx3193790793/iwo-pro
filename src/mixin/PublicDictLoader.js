//通用字典请求 mixin

export default {
  data() {
    return {}
  },
  beforeCreate() {
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeMount() {
    if (this.$options?.dicts?.length) this._publicDictLoader(this.$options.dicts, 'dict');
    if (this.$options?.cusDicts?.length) this._publicDictLoader(this.$options.cusDicts, 'customDict');
    if (this.$options?.webDicts?.length) this._publicDictLoader(this.$options.webDicts, 'web');//走web服务的字典 非系统配置页面调用
  },
  mounted() {
  },
  methods: {
    _publicDictLoader(dicts, type = 'dict') {
      this.$store.dispatch('dictionaries/GET_DICTIONARIES', {type, dicts});
    }
  },
  beforeDestroy() {
  },
}
