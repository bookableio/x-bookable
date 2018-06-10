export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    compile(element, attrs) {
      return (scope, element) => {
        const root = scope.$root;

        const refresh = () => {
          const href = attrs.bookableHref || attrs.bHref;
          root.business && href && element.attr('href', root.$eval(href) || '');
        };

        root.$on('bookableloaded', () => {
          $timeout(refresh, 0);
        });
        $timeout(refresh, 0);
      };
    }
  };
}];
