import bookable from 'bookable';

export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attrs) {
      element.css('display', 'none');

      const refresh = () => {
        const bbsid = attrs.bookableBbsIf || attrs.bBbsIf;

        bookable.get(`/app/bbs/${scope.business.serviceid}/${bbsid}/data`, {
          offset: 0,
          limit: 1
        }).localcache(3000).exec((err, list) => {
          !err && list.total > 0 && element.css('display', null);
        });
      };

      scope.$root.$watch('business', () => {
        $timeout(refresh, 0);
      });
      $timeout(refresh, 0);
    }
  };
}];
