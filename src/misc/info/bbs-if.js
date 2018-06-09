import bookable from 'bookable';

export default ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    scope: {},
    link(scope, element, attrs) {
      const root = scope.$root;

      const refresh = () => {
        const bbsid = attrs.bookableBbsIf || attrs.bBbsIf;
        if( !root.business || !bbsid ) return;

        bookable.get(`/app/bbs/${root.business.serviceid}/${bbsid}/data`, {
          offset: 0,
          limit: 1
        }).localcache(3000).exec((err, list) => {
          !err && list.total > 0 && element.css('display', null);
        });
      };

      root.$on('bookableloaded', () => {
        $timeout(refresh, 0);
      });

      element.css('display', 'none');
      $timeout(refresh, 0);
    }
  };
}];
