import xmodal from 'x-modal';

function loadscript(done) {
  if( window.IMP ) return done(null, window.IMP);

  const script = document.createElement('script');
  script.src = 'https://service.iamport.kr/js/iamport.payment-1.1.5.js';
  script.onload = function () {
    done(null, window.IMP);
  };
  script.onerror = function () {
    done(new Error('script load error'));
  };

  document.head.appendChild(script);
}

export default (options = {}, done) => {
  const paymentmethod = options.paymentmethod;
  const reservation = options.reservation;

  if( !paymentmethod || ~['default', 'banking', 'direct'].indexOf(paymentmethod.type) ) {
    return xmodal.confirm('예약하시겠습니까?', (b) => {
      if( b ) return done();
    });
  }

  if( paymentmethod.type === 'iamport' ) {
    loadscript((err, IMP) => {
      if( err ) return done(err);

      IMP.init(paymentmethod.options.cid);
      IMP.request_pay({
        name : options.name,
        amount : reservation.price,
        pg : paymentmethod.options.pg,
        pay_method : paymentmethod.options.method,
        merchant_uid : reservation.vid,
        buyer_email : reservation.email || '',
        buyer_name : reservation.name,
        buyer_tel : reservation.mobile || '',
        buyer_addr : reservation.info.address || '',
        buyer_postcode : reservation.info.postcode || '',
      }, (response) => {
        if ( !response.success ) return done(new Error('결제에 실패하였습니다.' + response.error_msg));

        done(null, {
          name: response.name,
          apply_num: response.apply_num,
          imp_uid: response.imp_uid,
          merchant_uid: response.merchant_uid
        });
      });
    });
  } else {
    return done(new Error('잘못된 결제방법 (프로그램 오류)'));
  }
};
