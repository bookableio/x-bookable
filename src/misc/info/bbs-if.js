import bookable from 'bookable';

export default ['$timeout','threshold',  function($timeout, threshold) {
  return {
    restrict: 'A',
    compile(element, attrs) {
      return (scope, element) => {
        const root = scope.$root;

        const refresh = threshold(() => {
          const business = root.business;
          const bbsid = attrs.bookableBbs || attrs.bBbs;
          const bbsif = attrs.bookableBbsIf || attrs.bBbsIf;
          if( !business || !bbsid || !bbsif ) return;

          bookable.get(`/app/bbs/${business.serviceid}/${bbsid}`).localcache(3000).exec((err, bbs) => {
            scope.err = err;
            scope.bbs = bbs;
            scope.business = business;
            scope.dom = element[0];
            scope.element = element;

            const value = scope.$eval(bbsif);
            element.css('display', value ? '' : 'none');
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
