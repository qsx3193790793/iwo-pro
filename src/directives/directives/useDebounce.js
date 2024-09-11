/**
 * 防抖指令
 * @param el 指令绑定的元素
 * @param binding 指令绑定的值
 * @param binding.value.callback 回调函数
 * @param binding.value.params 回调函数参数
 * @param binding.value.delay 延迟时间
 * @example
 * <button v-debounce="{callback: handleLike, params: { test: 0 }}">防抖</button> handleLike 为函数 params 为传入的参数
 */
export default {
  name: 'debounce',//防抖
  bind(el, binding) {
    let timer = null
    el.addEventListener('click', (e) => {
      // 阻止默认事件
      e.preventDefault()
      // 阻止冒泡
      e.stopPropagation()

      if (timer) {
        clearTimeout(timer)
      }

      let delay = binding.value?.delay || 1000

      timer = setTimeout(
        () => {
          const {callback, params} = binding.value
          // callback 不是函数
          if (!callback || typeof callback !== 'function') {
            throw new Error('callback is not a function')
          }
          callback(params ? params : e)
          // 重置计时器
          timer = null
        }, delay)
    })
  }
}
