export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attrs) {
      element.css('display', 'none');

      const refresh = () => {
        const value = attrs.bookableIf || attrs.bIf;
        element.css('display', value ? null : 'none');
      };
      scope.$root.$watch('business', () => {
        //console.log('watch', scope.business, attrs.bInfo);
        $timeout(refresh, 0);
      });
      $timeout(refresh, 0);
    }
  };
}];
