export default (threshold = 100, fn) => {
  let timer;

  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, threshold);
  };
};
