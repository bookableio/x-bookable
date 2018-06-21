import bookable from 'bookable';

export default ['$timeout','threshold',  function($timeout, threshold) {
  return {
    restrict: 'A',
    compile(element, attrs) {
      return (scope, element) => {
        const root = scope.$root;

        const refresh = threshold(() => {
          const business = root.business;
          const bbsid = attrs.bookableBbsExists || attrs.bBbsExists;
          if( !business || !bbsid ) return;

          bookable.get(`/app/bbs/${root.business.serviceid}/${bbsid}`).localcache(3000).exec((err, bbs) => {
            !err && bbs && bbs.total > 0 && element.css('display', '');
          });
        }, 10);

        root.$on('bookableloaded', () => {
          $timeout(refresh, 0);
        });

        element.css('display', 'none');
        $timeout(refresh, 0);
      };
    }
  };
}];
