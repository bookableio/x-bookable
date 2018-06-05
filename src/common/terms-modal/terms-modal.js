import xmodal from 'x-modal';
import bookable from 'bookable';
import template from './terms-modal.html';

export default {
  open(id) {
    if( !id ) return console.error('missing arguments');

    bookable.info({
      id
    }).exec((err, accommodation) => {
      if( err ) return console.error(err);
      if( !accommodation ) return console.error(new Error('서비스를 찾을 수 없습니다.'));

      const terms = accommodation.terms || {};
      const termstext = terms.terms
         + '<br><br><h2 class="text-center">환불규정</h2><br>' + terms.refund
         + '<br><br><h2 class="text-center">유의사항</h2><br>' + terms.notice
         + '<br><br><h2 class="text-center">입금안내</h2><br>' + terms.payment;

      const html = template.split('{{termstext}}').join(termstext);

      xmodal.open({
        html
      }, (err) => {
        if( err ) return console.error(err);
      });
    });
  }
};
