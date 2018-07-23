import xmodal from 'x-modal';
import bookable from 'bookable';
import paymentfn from '../paymentfn.js';
import termsmodal from '../../misc/terms-modal/terms-modal';

document.createElement('ng-slick');

export default ['safeApply', 'event', '$timeout', 'threshold', function(safeApply, event, $timeout, threshold) {
  return {
    require: '?ngModel',
    template: require('./form.html'),
    replace: true,
    scope: {
      rooms: '=ngRooms',
      extraoptions: '=ngExtraOptions'
    },
    restrict: 'E',
    link: (scope, element, attrs) => {
      const error = (error) => {
        scope.error = error;
        safeApply(scope);
      };

      const load = () => {
        bookable.info({
          id: attrs.aid,
          serviceid: attrs.serviceid,
          host: location.hostname
        }).exec((err, accommodation) => {
          if( err ) return error(err);

          scope.loaded = true;
          scope.accommodation = accommodation;
          scope.selectedpaymentmethod = accommodation.paymentmethods && accommodation.paymentmethods[0];
          safeApply(scope);
        });
      };

      const validate = threshold(() => {
        if( !scope.rooms ) return;

        delete scope.validated;

        bookable.accommodation(scope.accommodation.id).reservation.validate({
          name: '-',
          mobile: '-',
          rooms: scope.rooms,
          extra: scope.extraoptions
        }).exec((err, validated) => {
          if( err ) return error(err);

          scope.validated = validated;
          safeApply(scope);
        });
      }, 100);

      const selectpaymentmethod = (paymentmethod) => {
        scope.selectedpaymentmethod = paymentmethod;
        safeApply(scope);
      };

      const complete = () => {
        const accommodation = scope.accommodation;
        const reservation = scope.validated;
        const form = scope.form;
        const paymentmethod = scope.selectedpaymentmethod;

        scope.error = null;
        safeApply(scope);

        if( !accommodation ) return error(new Error('서비스가 로드되지 않았습니다.'));
        if( !reservation ) return error(new Error('연결된 예약이 없습니다.'));
        //if( !paymentmethod ) return error(new Error('결제 방법을 선택해주세요.'));
        if( !form ) return error(new Error('프로그램 오류입니다. 다시 시도해주세요.'));
        if( !reservation.rooms.length ) return error(new Error(`예약할 ${accommodation.unitname}이 없습니다.`));
        if( !form.termsofuse ) return error(new Error('이용약관에 동의하셔야 합니다.'));
        if( !form.name ) return error(new Error('예약자명을 입력해주세요.'));
        if( !form.mobile ) return error(new Error('휴대전화번호를 입력해주세요.'));

        reservation.aid = accommodation.id;
        reservation.name = form.name;
        reservation.mobile = form.mobile;
        reservation.email = form.email;
        reservation.request = form.request;

        bookable.accommodation(accommodation.id).reservation.validate(reservation).exec((err, reservation) => {
          if( err ) return error(err);
          if( reservation.errors ) return error(new Error('예약에 오류가 있습니다.'));

          paymentfn(paymentmethod && {
            type: paymentmethod.type,
            name : `${accommodation.unitname} 예약`,
            price : reservation.price,
            options: paymentmethod.options && {
              pg : paymentmethod.options.pg,
              cid: paymentmethod.options.cid,
              pay_method : paymentmethod.options.method,
              merchant_uid : reservation.vid,
              buyer_name : reservation.name,
              buyer_email : reservation.email,
              buyer_tel : reservation.mobile,
              buyer_addr : reservation.info.address,
              buyer_postcode : reservation.info.postcode
            }
          }, (err, result) => {
            if( err ) return error(err);

            if( paymentmethod ) reservation.payment = {
              paymentmethodid: paymentmethod.id,
              amount: reservation.price,
              options: result
            };

            bookable.accommodation(accommodation.id).reservation.create(reservation).exec((err, reservation) => {
              if( err ) return error(err);

              xmodal.success('예약이 신청되었습니다.', '예약이 확정되면 문자메시지와 이메일로 통보해 드리겠습니다.');

              setTimeout(() => {
                attrs.ngComplete && scope.$parent.$eval(attrs.ngComplete, {$reservation: reservation});
                event.fire(element, 'complete', {reservation});
              }, 250);
            });
          });
        });
      };

      const viewterms = () => {
        termsmodal.open(scope.accommodation.id);
      };

      const clear = () => {
        delete scope.validated;
        scope.form = {};
        safeApply(scope);
      };

      scope.uid = Math.random();
      scope.form = {};
      scope.load = load;
      scope.selectpaymentmethod = selectpaymentmethod;
      scope.complete = complete;
      scope.viewterms = viewterms;
      scope.validate = validate;
      scope.clear = clear;

      attrs.$observe('vertical', () => {
        scope.vertical = 'vertical' in attrs && !attrs.vertical !== 'false';
        safeApply(scope);
      });

      scope.$watch('rooms', () => validate());
      scope.$watch('extraoptions', () => validate());

      $timeout(load, 0);
    }
  };
}];
