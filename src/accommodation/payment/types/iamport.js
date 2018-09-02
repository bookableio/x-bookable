import shortid from 'shortid';

const loadscript = (done) => {
  if( window.IMP ) return done(null, window.IMP);

  const script = document.createElement('script');
  script.src = 'https://service.iamport.kr/js/iamport.payment-1.1.5.js';
  script.onload = () => {
    done(null, window.IMP);
  };
  script.onerror = () => {
    done(new Error('script load error'));
  };

  document.head.appendChild(script);
};

export default {
  prepare(options, done) {
    done(null, {
      merchant_uid: `mid-${shortid()}`
    });
  },
  pay(options = {}, done) {
    console.log('options', options);

    const paymentmethod = options.paymentmethod;
    const reservation = options.reservation;
    const payment = reservation.payment;

    console.log('payment', payment);

    loadscript((err, IMP) => {
      if( err ) return done(err);

      IMP.init(paymentmethod.options.cid);
      IMP.request_pay({
        name : `${reservation.name}님의 예약결제`,
        amount : reservation.price,
        pg : paymentmethod.options.pg,
        pay_method : paymentmethod.options.method,
        merchant_uid : payment.options.merchant_uid,
        buyer_email : reservation.email,
        buyer_name : reservation.name,
        buyer_tel : reservation.mobile,
        buyer_addr : reservation.info && reservation.info.address,
        buyer_postcode : reservation.info && reservation.info.postcode,
      }, (response) => {
        if ( !response.success ) return done(new Error('결제에 실패하였습니다.' + response.error_msg));
        done(null, response);
      });
    });
  }
};


