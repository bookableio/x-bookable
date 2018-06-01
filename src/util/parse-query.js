import querystring from 'querystring-browser';

export default (name) => {
  let value = querystring.parse(location.search.substring(1) || '')[name];
  if( !value ) {
    const hash = location.hash.substring(1);
    if( ~hash.indexOf('?') )
      value = querystring.parse(hash.substring(hash.indexOf('?') + 1) || '')[name];
  }

  return value;
};
