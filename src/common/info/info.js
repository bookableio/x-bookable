export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attrs) {
      const refresh = () => {
        const value = attrs.bookableInfo || attrs.bInfo;
        scope.business && value && element.html(scope.$eval(value) || '');
      };

      scope.$root.$watch('business', () => refresh);
      $timeout(refresh, 0);
    }
  };
}];
