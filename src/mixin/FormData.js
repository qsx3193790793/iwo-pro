//formData  noMerge不合并相同表单 默认不合并 B页面相同的formData会覆盖A页面formData
import {mapGetters} from 'vuex';

export default (key, formData, noMerge = true) => {
  const upperKey = key.slice(0, 1).toUpperCase() + key.substr(1);
  return {
    data() {
      return {}
    },
    watch: {
      [key]: {
        handler(v) {
          // console.log(`on${upperKey}Changed`, this[key]);
          this[`on${upperKey}Changed`] && this[`on${upperKey}Changed`](v);
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters({STORE_FORM_DATA: 'formData/GET_FORM_DATA_BY_KEY'}),
      [key]: {
        get() {
          return this.STORE_FORM_DATA(key)
        },
        set(v) {
          console.log(`${key}-set`, v);
          if (v) return this.$store.commit('formData/SET_FORM_DATA', {[key]: this.$$deepMerge([this.$store.getters['formData/GET_FORM_DATA'][key] || {}, v || {}])});
        }
      }
    },
    beforeCreate() {
      console.log('formData mixin create', `on${upperKey}Changed`, JSON.stringify(formData), key, this[key])
      this.$store.commit('formData/SET_FORM_DATA', {[key]: this.$$deepMerge([!noMerge ? (this.$store.getters['formData/GET_FORM_DATA'][key] || {}) : {}, formData])});
    },
  }
}
