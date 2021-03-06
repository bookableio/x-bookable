export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    compile(element, attrs) {
      return (scope, element) => {
        const root = scope.$root;

        const refresh = () => {
          const key = attrs.bookableInfo || attrs.bInfo;
          root.business && key && element.html(root.$eval(key) || '');
        };

        root.$on('bookableloaded', () => {
          $timeout(refresh, 0);
        });
        $timeout(refresh, 0);
      };
    }
  };
}];
