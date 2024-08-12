//防抖
//debounce防抖
export default (fn, delay = 500) => {
  let debounceHandler = null;
  return function () {
    clearTimeout(debounceHandler);
    debounceHandler = setTimeout(() => fn.call(this, ...arguments), delay);
  }
};
