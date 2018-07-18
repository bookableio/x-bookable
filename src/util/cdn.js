import meta from './meta';

const cdnurl = meta('bookable.cdn') || 'https://cdn.bookable.io';

export default (url) => {
  if( !url ) return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  if( ~url.indexOf('data:') ) return url;
  if( url[0] !== '/' ) url = '/' + url;
  return cdnurl + url;
};
