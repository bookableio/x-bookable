import bookable from 'bookable';

export default ['safeApply', '$timeout', 'evalattr', function(safeApply, $timeout, evalattr) {
  return {
    template: require('./map-desc.html'),
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

      const refresh = () => {
        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, business) => {
          if( err ) return error(err);
          if( !business ) return error(new Error('존재하지 않는 서비스'));

          scope.business = business;

          safeApply(scope);
        });
      };

      scope.refresh = refresh;

      $timeout(refresh, 0);
    }
  };
}];
