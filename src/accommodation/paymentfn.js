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

export default (info, done) => {
  if( !info || ~['banking', 'direct'].indexOf(info.type) ) {
    return xmodal.confirm('예약하시겠습니까?', (b) => {
      if( b ) return done();
    });
  }

  if( info.type === 'pg' ) {
    loadscript((err, IMP) => {
      if( err ) return done(err);

      IMP.init(info.options.cid);
      IMP.request_pay({
        name : info.name,
        amount : info.price,
        pg : info.options.pg,
        pay_method : info.options.pay_method,
        merchant_uid : info.options.uid,
        buyer_email : info.options.buyer_email || '',
        buyer_name : info.options.buyer_name,
        buyer_tel : info.options.buyer_tel || '',
        buyer_addr : info.options.buyer_addr || '',
        buyer_postcode : info.options.buyer_postcode || '',
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
