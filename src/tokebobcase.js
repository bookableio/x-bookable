export default (name) =>
  name && name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
