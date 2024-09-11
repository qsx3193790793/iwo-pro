//isTrigger是否出发长按 用来阻止冒泡用
let timer = null, isTrigger = null;

export default {
  name: 'longPress',//长按
  bind(el, binding, vnode, oldVnode) {
    binding.start = e => {
      console.log('longPress active', e)
      if (e.type !== 'touchstart' && (e.button !== 0 || e.type === 'click')) return;
      if (timer == null) {
        timer = setTimeout(function () {
          console.log('longPress active', e)
          //执行长按功能函数
          isTrigger = true;
          binding.value(e);
        }, binding.arg)
      }
    }
    binding.touchmove = e => {
      isTrigger && e.preventDefault();//阻止滑动
    }
    binding.cancel = e => {
      if (isTrigger) e && e.stopPropagation();
      if (timer !== null) {
        clearTimeout(timer);
        timer = isTrigger = null;
      }
    }
    // 添加事件监听器
    el.addEventListener("mousedown", binding.start, true);
    el.addEventListener("touchstart", binding.start, true);
    el.addEventListener("click", binding.cancel, true);
    el.addEventListener("mouseout", binding.cancel, true);
    el.addEventListener("touchend", binding.cancel, true);
    el.addEventListener("touchcancel", binding.cancel, true);
    el.addEventListener("touchmove", binding.touchmove, false);
  },
  unbind(el, binding, vnode, oldVnode) {
    // 移除事件监听器
    el.removeEventListener("mousedown", binding.start, true);
    el.removeEventListener("touchstart", binding.start, true);
    el.removeEventListener("click", binding.cancel, true);
    el.removeEventListener("mouseout", binding.cancel, true);
    el.removeEventListener("touchend", binding.cancel, true);
    el.removeEventListener("touchcancel", binding.cancel, true);
    el.removeEventListener("touchmove", binding.touchmove, false);
  }
}
