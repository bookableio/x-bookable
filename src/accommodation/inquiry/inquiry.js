import xmodal from 'x-modal';
import bookable from 'bookable';

export default ['safeApply', 'event', 'staged', '$timeout', 'evalattr', function(safeApply, event, staged, $timeout, evalattr) {
  return {
    require: '?ngModel',
    template: require('./inquiry.html'),
    replace: true,
    scope: {
      ngModel: '=',
      mobile: '@',
      cn: '@'
    },
    restrict: 'E',
    link(scope, element, attrs, ngModel) {
      function error(error) {
        xmodal.error(error);
        scope.error = error;
        safeApply(scope);
      }

      function refresh(done) {
        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          // 만약 외부시스템을 사용하고 팝업이라면 라우팅을 중지하고 팝업창을 띄운다.
          const external = accommodation.info && accommodation.info.external;
          if( external && external.use && external.popup && external.inquiry ) {
            const url = external.inquiry;
            const width = +external.width || 800;
            const height = +external.height || 600;
            const left = Math.abs((window.screen.width - width) / 2);
            let top = Math.abs((window.screen.height - height) / 2);
            if( top <= 0 ) top = 0;

            window.open(url, 'booking', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left + ', scrollbars=no,resizable=no');
            //res.writestate = false;
            return;
          }

          scope.accommodation = accommodation;
          safeApply(scope);

          done && done();
        });
      }

      function inquiry() {
        const accommodation = scope.accommodation;
        const mobile = scope.form.mobile;
        const cn = scope.form.cn;

        if( !mobile ) return xmodal.alert('휴대전화번호를 입력해주세요.');
        if( !cn ) return xmodal.alert('인증번호를 입력해주세요.');

        scope.reservation = null;
        scope.loaded = false;

        bookable.accommodation(accommodation.id).reservation.inquiry({
          mobile,
          cn
        }).exec((err, reservation) => {
          if( err ) return error(err);

          scope.reservation = reservation;
          scope.loaded = true;

          if( reservation ) {
            reservation.cancellable = !!~['confirm', 'waiting'].indexOf(reservation.status);
          }

          safeApply(scope);
        });
      }

      function status(status) {
        // ['waiting', 'confirm', 'cancel', 'cancelled', 'remove']
        if( status === 'waiting' ) return '확인 대기중';
        else if( status === 'confirm' ) return '확정';
        else if( status === 'cancel' ) return '취소 요청중';
        else if( status === 'cancelled' ) return '취소됨';
        else if( status === 'remove' ) return '취소됨';
        return status;
      }

      function cancel() {
        const accommodation = scope.accommodation;
        const reservation = scope.reservation;
        const mobile = scope.form.mobile;
        const cn = scope.form.cn;

        if( !reservation ) return;
        if( !mobile ) return xmodal.alert('휴대전화번호를 입력해주세요.');
        if( !cn ) return xmodal.alert('인증번호를 입력해주세요.');

        xmodal.confirm('정말 취소 요청하시겠습니까?', (b) => {
          if( !b ) return;

          bookable.accommodation(accommodation.id).reservation.reqcancel({
            mobile: scope.form.mobile,
            cn: scope.form.cn,
            id: reservation.id
          }).exec((err) => {
            if( err ) return error(err);

            xmodal.success('취소 요청 되었습니다.', '취소가 완료되면 문자메시지로 알려드립니다.');
            inquiry();
          });
        });
      }

      function load() {
        refresh(() => {
          if( scope.form.cn && scope.form.mobile ) {
            inquiry(scope.form.mobile, scope.form.cn);
          }
        });
      }

      scope.form = {};
      scope.inquiry = inquiry;
      scope.status = status;
      scope.cancel = cancel;

      attrs.$observe('cn', () => {
        scope.form.cn = evalattr(attrs.cn);
        load();
      });
      attrs.$observe('mobile', () => {
        scope.form.mobile = evalattr(attrs.mobile);
        load();
      });

      $timeout(load, 0);
    }
  };
}];
