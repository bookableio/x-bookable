import iamport from './types/iamport';

const TYPES = {
  iamport
};

export default {
  prepare(options, done) {
    const paymentmethod = options.paymentmethod;
    if( !paymentmethod || ~['default', 'banking', 'direct'].indexOf(paymentmethod.type) ) return done();

    const type = TYPES[paymentmethod.type];
    if( !type ) return done(new Error('잘못된 결제방법 (프로그램 오류):' + paymentmethod.type));

    type.prepare(options, done);
  },
  pay(options = {}, done) {
    const paymentmethod = options.paymentmethod;
    if( !paymentmethod || ~['default', 'banking', 'direct'].indexOf(paymentmethod.type) ) return done();

    const type = TYPES[paymentmethod.type];
    if( !type ) return done(new Error('잘못된 결제방법 (프로그램 오류):' + paymentmethod.type));

    type.pay(options, done);
  }
};
