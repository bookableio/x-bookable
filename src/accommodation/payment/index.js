import iamport from './types/iamport';

const TYPES = {
  iamport
};

export default {
  prepare(business, reservation, paymentmethod, done) {
    if( !paymentmethod ) return done();

    const provider = TYPES[paymentmethod.provider];
    if( !provider ) return done();

    provider.prepare(business, reservation, paymentmethod, done);
  },
  pay(business, reservation, paymentmethod, done) {
    if( !paymentmethod ) return done();

    const provider = TYPES[paymentmethod.provider];
    if( !provider ) return done();

    provider.pay(business, reservation, paymentmethod, done);
  }
};
