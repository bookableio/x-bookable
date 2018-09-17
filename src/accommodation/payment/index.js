import iamport from './types/iamport';

const TYPES = {
  iamport
};

export default {
  prepare(reservation, paymentmethod, done) {
    if( !paymentmethod ) return done();

    const provider = TYPES[paymentmethod.provider];
    if( !provider ) return done();

    provider.prepare(reservation, paymentmethod, done);
  },
  pay(reservation, paymentmethod, done) {
    if( !paymentmethod ) return done();

    const provider = TYPES[paymentmethod.provider];
    if( !provider ) return done();

    provider.pay(reservation, paymentmethod, done);
  }
};
