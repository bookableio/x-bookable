export default (fn, threshold) => {
  let timer;

  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, +threshold || 1);
  };
};
