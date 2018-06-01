export default (name, alt) => {
  const tag = document.head.querySelector('meta[name="' + name + '"]');
  if( !tag ) return alt;

  const value = tag.getAttribute('content') || tag.getAttribute('value');
  return value && value.trim() || alt;
};
