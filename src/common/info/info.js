export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attrs) {
      const refresh = () => {
        if( !scope.business && attrs.bInfo ) return;
        scope.business && attrs.bInfo && element.html(scope.$eval(attrs.bInfo) || '');
      };
      scope.$root.$watch('business', () => {
        //console.log('watch', scope.business, attrs.bInfo);
        $timeout(refresh, 0);
      });
      $timeout(refresh, 0);
    }
  };
}];
