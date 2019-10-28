import xmodal from 'x-modal';
import bookable from 'bookable';
import template from './privacy-modal.html';

export default {
  open(id) {
    if( !id ) return console.error('missing arguments');

    bookable.info({
      id
    }).exec((err, accommodation) => {
      if( err ) return console.error(err);
      if( !accommodation ) return console.error(new Error('서비스를 찾을 수 없습니다.'));

      const terms = accommodation.terms || {};
      const termstext = terms.privacy;

      const html = template.split('{{termstext}}').join(termstext);

      xmodal.open({
        html
      }, (err) => {
        if( err ) return console.error(err);
      });
    });
  }
};
