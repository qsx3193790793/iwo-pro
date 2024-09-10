// 拖拽

export default {
  name: 'useDraggable',
  bind(el) {
    const moveEl = el.querySelector('.el-dialog');
    const move_header = el.querySelector('.el-dialog__header');
    const move_footer = el.querySelector('.el-dialog__footer');
    console.log('moveEl', moveEl, move_header, move_footer)
    let startPosition = {x: 0, y: 0};
    let dialogPosition = {x: 0, y: 0};
    let dragging = false;

    function isMoveHandler(target) {
      const classes = target?.getAttribute('class');
      return classes?.indexOf('el-dialog__header') >= 0 || classes?.indexOf('el-dialog__footer') >= 0;
    }

    const handleMouseDown = (e) => {
      if (!isMoveHandler(e.target || e.srcElement)) return;
      const rect = moveEl.getBoundingClientRect();
      console.log('moveEle', rect);
      startPosition.x = e.clientX;
      startPosition.y = e.clientY;
      dialogPosition.x = rect.x || 0;
      dialogPosition.y = rect.y || 0;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      dragging = true;

      // e.stopPropagation();
      // e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (dragging) {
        const offsetX = e.clientX - startPosition.x;
        const offsetY = e.clientY - startPosition.y;
        // moveEl.style.left = `${dialogPosition.x + offsetX}px`;
        // moveEl.style.top = `${dialogPosition.y + offsetY}px`;
        const deltaX = dialogPosition.x + offsetX;
        const deltaY = dialogPosition.y + offsetY;
        console.log(offsetX, offsetY, deltaX, deltaY)
        moveEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        // startPosition.x = dialogPosition.x = deltaX;
        // startPosition.y = dialogPosition.y = deltaY;
      }
    };

    const handleMouseUp = (e) => {

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      dragging = false;
    };

    el.addEventListener('mousedown', handleMouseDown);
  },
};
