import xmodal from 'x-modal';
import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    require: '?ngModel',
    template: require('./roomtypes.html'),
    replace: true,
    scope: {
      ngModel: '='
    },
    restrict: 'E',
    link(scope, element, attrs) {
      const error = (error) => {
        xmodal.error(error);
        scope.error = error;
        safeApply(scope);
      };

      function refresh(done) {
        bookable.info({
          id: attrs.aid,
          serviceid: attrs.serviceid,
          host: location.hostname
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = accommodation;
          safeApply(scope);
          done && done();
        });
      }

      function select(roomtype) {
        attrs.ngSelect && scope.$parent.$eval(attrs.ngSelect, {roomtype});
        event.fire(element, 'select', {roomtype});
      }

      attrs.$observe('serviceid', () => {
        attrs.serviceid && refresh();
      });

      attrs.$observe('buttonLabel', () => {
        scope.buttonLabel = attrs.buttonLabel;
        safeApply(scope);
      });

      attrs.$observe('listingStyle', () => {
        scope.listingStyle = attrs.listingStyle;
        safeApply(scope);
      });

      attrs.$observe('col', () => safeApply(scope, () => scope.col = +evalattr(attrs.col)));
      attrs.$observe('colxs', () => safeApply(scope, () => scope.colxs = +evalattr(attrs.colxs)));
      attrs.$observe('colsm', () => safeApply(scope, () => scope.colsm = +evalattr(attrs.colsm)));
      attrs.$observe('colmd', () => safeApply(scope, () => scope.colmd = +evalattr(attrs.colmd)));
      attrs.$observe('collg', () => safeApply(scope, () => scope.collg = +evalattr(attrs.collg)));

      scope.buttonLabel = attrs.buttonLabel;
      scope.listingStyle = attrs.listingStyle;
      scope.refresh = refresh;
      scope.select = select;

      event.regist(element, attrs, 'select');

      $timeout(refresh, 0);
    }
  };
}];
