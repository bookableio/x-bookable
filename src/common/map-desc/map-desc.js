export default ['safeApply', '$timeout', function(safeApply, $timeout) {
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
        scope.$root.ensurebusiness({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, business) => {
          if( err ) return error(err);
          if( !business ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.business = business;

          safeApply(scope);
        });
      };

      scope.refresh = refresh;

      scope.$root.$watch('business', refresh);
      attrs.$observe('aid', refresh);
      attrs.$observe('serviceid', refresh);

      $timeout(refresh, 0);
    }
  };
}];
