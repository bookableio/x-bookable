import bookable from 'bookable';

export default ['safeApply', '$timeout', function(safeApply, $timeout) {
  return {
    require: '?ngModel',
    template: require('./terms.html'),
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
        if( !attrs.termsid ) {
          scope.text = null;
          safeApply(scope);
          return;
        }

        bookable.info({
          id: attrs.aid,
          serviceid: attrs.serviceid,
          host: location.hostname
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = accommodation;
          scope.text = accommodation && accommodation.terms && accommodation.terms[attrs.termsid];

          safeApply(scope);
        });
      };

      scope.refresh = refresh;

      attrs.$observe('serviceid', refresh);
      attrs.$observe('termsid', refresh);

      $timeout(refresh, 0);
    }
  };
}];
