export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    template: require('./roomtypes.html'),
    replace: true,
    scope: {
    },
    restrict: 'E',
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      function refresh() {
        scope.$root.ensurebusiness({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, business) => {
          if( err ) return error(err);
          if( !business ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = business;
          safeApply(scope);
        });
      }

      function select(roomtype) {
        attrs.ngSelect && scope.$parent.$eval(attrs.ngSelect, {roomtype});
        event.fire(element, 'select', {roomtype});
      }

      scope.$root.$watch('business', refresh);
      attrs.$observe('aid', refresh);
      attrs.$observe('serviceid', refresh);

      attrs.$observe('buttonLabel', () => {
        scope.buttonLabel = evalattr(attrs.buttonLabel);
        safeApply(scope);
      });

      attrs.$observe('listingtype', () => {
        scope.listingtype = attrs.listingtype;
        safeApply(scope);
      });

      attrs.$observe('border', () => {
        scope.border = 'border' in attrs && attrs.border !== 'false';
        safeApply(scope);
      });

      attrs.$observe('col', () => safeApply(scope, () => scope.col = +evalattr(attrs.col)));
      attrs.$observe('colxs', () => safeApply(scope, () => scope.colxs = +evalattr(attrs.colxs)));
      attrs.$observe('colsm', () => safeApply(scope, () => scope.colsm = +evalattr(attrs.colsm)));
      attrs.$observe('colmd', () => safeApply(scope, () => scope.colmd = +evalattr(attrs.colmd)));
      attrs.$observe('collg', () => safeApply(scope, () => scope.collg = +evalattr(attrs.collg)));

      scope.listingtype = attrs.listingtype;
      scope.refresh = refresh;
      scope.select = select;

      event.regist(element, attrs, 'select');

      $timeout(refresh, 0);
    }
  };
}];
