export default () => (target, delay, options = {behavior: 'smooth'}) => {
  setTimeout(() => {
    target.scrollIntoView(options);
  }, +delay || 10);
};
