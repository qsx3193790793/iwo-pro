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
    if (this.$options?.webCusDicts?.length) this._publicDictLoader(this.$options.webCusDicts, 'customWeb');//走web服务的字典 自定义字典
    if (this.$options?.webDicts?.length) this._publicDictLoader(this.$options.webDicts, 'web');//走web服务的字典  系统字典
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
