import moment from 'moment';
import angular from 'angular';
import bookable from 'bookable';

export default ['safeApply', 'event', '$timeout', 'evalattr', function(safeApply, event, $timeout, evalattr) {
  return {
    require: '?ngModel',
    template: require('./finderform.html'),
    replace: true,
    scope: {
      ngModel: '='
    },
    restrict: 'E',
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = accommodation;
          scope.maximum = (() => {
            let max = 0;
            (accommodation.roomtypes || []).forEach((roomtype) => {
              if( roomtype.maximum > max ) max = roomtype.maximum;
            });
            return max;
          })() || 1;
          scope.ready = true;
          scope.formdata = {
            guests: 0,
            days: 1
          };

          safeApply(scope);
        });
      };

      const submit = () => {
        if( !scope.ready ) return;
        if( !scope.formdata || !scope.formdata.checkin ) return;

        const accommodation = scope.accommodation;
        const days = +scope.formdata.days || 1;
        const checkin = moment(scope.formdata.checkin, 'YYYY-MM-DD');
        const checkout = checkin.clone().add(days, 'days');
        const guests = +scope.formdata.guests || 0;

        if( !checkin.isValid() ) return console.error('invalid checkin');

        const submitTo = attrs.submitTo;
        if( submitTo ) {
          const nodes = document.querySelectorAll(submitTo);
          [].forEach.call(nodes, (node) => {
            const directive = angular.element(node).isolateScope();

            directive && directive.find && directive.find({
              accommodation,
              checkin: checkin.format('YYYYMMDD'),
              checkout: checkout.format('YYYYMMDD'),
              guests
            });
          });
        }

        attrs.ngSubmit && scope.$parent.$eval(attrs.ngSubmit, {
          $accommodation: accommodation,
          $checkin: checkin,
          $checkout: checkout,
          $guests: guests
        });

        event.fire(element, 'submit', {
          accommodation,
          checkin,
          checkout,
          guests
        });
      };

      scope.refresh = refresh;
      scope.submit = submit;

      $timeout(refresh, 0);
    }
  };
}];
