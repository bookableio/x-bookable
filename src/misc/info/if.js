export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attrs) {
      element.css('display', 'none');

      const refresh = () => {
        const key = attrs.bookableIf || attrs.bIf;
        const value = scope.business && key && scope.$eval(key);
        element.css('display', value ? null : 'none');
      };

      scope.$root.$watch('business', () => {
        $timeout(refresh, 0);
      });
      $timeout(refresh, 0);
    }
  };
}];
