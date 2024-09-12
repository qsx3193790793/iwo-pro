// 拖拽

export default {
  name: 'useDraggable',
  bind(el, binding) {
    binding.uuid = el.getAttribute('data-uuid');
    const moveEl = el.querySelector('.el-dialog');
    let startPosition = {x: 0, y: 0};
    let dialogOrgPosition = {x: 0, y: 0};
    let dialogCurrPosition = {x: 0, y: 0};
    let dragging = false, firstClick = true;

    function isMoveHandler(target) {
      const classes = target?.getAttribute('class');
      if (classes?.indexOf('el-dialog__header') >= 0 || classes?.indexOf('el-dialog__footer') >= 0) return true;
      return target.parentElement ? isMoveHandler(target.parentElement) : false;
    }

    function findUUID(target) {
      const classes = target?.getAttribute('class');
      if (classes?.indexOf('el-dialog__wrapper') >= 0) return target.getAttribute('data-uuid');
      return target.parentElement ? findUUID(target.parentElement) : null;
    }

    binding.handleMouseDown = (e) => {
      if (findUUID(e.target || e.srcElement) !== binding.uuid) return;//每个弹窗都需要赋予一个ID不然多个弹窗会一起移动
      if (!isMoveHandler(e.target || e.srcElement)) return;
      const rect = moveEl.getBoundingClientRect();
      if (firstClick) {
        dialogOrgPosition = {x: rect.x, y: rect.y};
        firstClick = false;//首次记录初始位置
      }
      startPosition.x = e.clientX;
      startPosition.y = e.clientY;
      dialogCurrPosition.x = rect.x || 0;
      dialogCurrPosition.y = rect.y || 0;

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      dragging = true;

      // e.stopPropagation();
      // e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (dragging) {
        const offsetX = e.clientX - startPosition.x;
        const offsetY = e.clientY - startPosition.y;
        const deltaX = dialogCurrPosition.x - dialogOrgPosition.x + offsetX;
        const deltaY = dialogCurrPosition.y - dialogOrgPosition.y + offsetY;
        moveEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    };

    const handleMouseUp = (e) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dragging = false;
    };

    window.addEventListener('mousedown', binding.handleMouseDown);
  },
  unbind(el, binding, vnode, oldVnode) {
    console.log('useDraggable unbind');
    // 移除事件监听器
    window.removeEventListener('mousedown', binding.handleMouseDown);
  }
};
