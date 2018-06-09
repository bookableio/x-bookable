export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    scope: {},
    link(scope, element, attrs) {
      const root = scope.$root;

      const refresh = () => {
        const key = attrs.bookableIf || attrs.bIf;
        const value = root.business && key && root.$eval(key);
        element.css('display', value ? null : 'none');
      };

      root.$on('bookableloaded', () => {
        $timeout(refresh, 0);
      });

      element.css('display', 'none');
      $timeout(refresh, 0);
    }
  };
}];
