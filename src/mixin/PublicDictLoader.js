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
