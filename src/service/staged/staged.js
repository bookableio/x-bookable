export default () => (element) => {
  const el = element[0] || element;
  return !!(el && el.parentNode);
};
