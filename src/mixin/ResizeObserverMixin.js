//ResizeObserver混入  变化时会触发onResizeObserverChanged 需要自行添加

export default {
  data() {
    return {
      roInstance: null,//ResizeObserver监听器实例
      debounceHandler: null//定时器句柄
    }
  },
  beforeCreate() {
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeMount() {
    this.addResizeObserver();
  },
  mounted() {
  },
  methods: {
    addResizeObserver() {
      this.roInstance = this.$$elementResizeObserver(document.getElementById('app'), rect => {
        clearTimeout(this.debounceHandler);
        this.debounceHandler = setTimeout(() => this.onResizeObserverChanged && this.onResizeObserverChanged(rect), 300);
      });
    },
  },
  beforeDestroy() {
    this.$$elementResizeUnobserve(this.roInstance, document.getElementById('app'));
  },
}
