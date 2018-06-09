export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attrs) {
      const refresh = () => {
        const key = attrs.bookableInfo || attrs.bInfo;
        scope.business && key && element.html(scope.$eval(key) || '');
      };

      scope.$root.$watch('business', () => {
        $timeout(refresh, 0);
      });
      $timeout(refresh, 0);
    }
  };
}];
