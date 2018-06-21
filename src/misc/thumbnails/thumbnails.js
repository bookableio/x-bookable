export default ['safeApply', '$timeout', 'slideshow', 'evalattr', function(safeApply, $timeout, slideshow, evalattr) {
  return {
    require: '?ngModel',
    template: require('./thumbnails.html'),
    replace: true,
    scope: {
      ngModel: '='
    },
    restrict: 'E',
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        if( scope.loaded ) return;

        const slidesetid = evalattr(attrs.slidesetid);
        const slideid = evalattr(attrs.slideid);

        if( !slidesetid ) return;

        scope.$root.ensurebusiness({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, business) => {
          if( err ) return error(err);
          if( !business ) return error(new Error('서비스를 찾을 수 없습니다.'));

          const slideset = business[slidesetid];

          if( !slideid && slideset && !('slideid' in attrs) ) {
            scope.slide = slideset;
          } else if( slideid && Array.isArray(slideset) ) {
            slideset.forEach((item) => {
              if( item.id === slideid ) scope.slide = item.photo;
            });
          }

          scope.business = business;
          scope.loaded = true;

          safeApply(scope);
        });
      };

      const openslideshow = (index) => {
        if( attrs.openSlideshow !== 'false' && scope.slide ) {
          slideshow(scope.slide, index);
        }
      };

      scope.refresh = refresh;
      scope.openslideshow = openslideshow;

      scope.$root.$watch('business', refresh);
      attrs.$observe('aid', refresh);
      attrs.$observe('serviceid', refresh);

      attrs.$observe('slideid', refresh);
      attrs.$observe('roomtypeid', refresh);
      attrs.$observe('ratio', () => {
        scope.ratio = evalattr(attrs.ratio);
        safeApply(scope);
      });

      attrs.$observe('col', () => safeApply(scope, () => scope.col = +evalattr(attrs.col)));
      attrs.$observe('colxs', () => safeApply(scope, () => scope.colxs = +evalattr(attrs.colxs)));
      attrs.$observe('colsm', () => safeApply(scope, () => scope.colsm = +evalattr(attrs.colsm)));
      attrs.$observe('colmd', () => safeApply(scope, () => scope.colmd = +evalattr(attrs.colmd)));
      attrs.$observe('collg', () => safeApply(scope, () => scope.collg = +evalattr(attrs.collg)));

      $timeout(refresh, 0);
    }
  };
}];
