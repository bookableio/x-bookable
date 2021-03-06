import $ from 'jquery';

export default ['safeApply', '$timeout', 'slideshow', 'evalattr', 'threshold', function(safeApply, $timeout, slideshow, evalattr, threshold) {
  return {
    require: '?ngModel',
    template: require('./photo-slide.html'),
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

      const refresh = threshold(() => {
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

          if( !slideid && slideset ) {
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
      }, 1);

      const openslideshow = (index) => {
        if( attrs.openSlideshow !== 'false' && scope.slide ) {
          slideshow(scope.slide, index);
        }
      };

      const loadbg = (el) => {
        if( !el || !el.style || el.style.backgroundImage ) return;

        const slide = $(el);
        const img = slide.attr('data-background') || slide.find('.x-bookable-photoslide-item').attr('data-background');
        if( img ) slide.css({
          'background-image': 'url(' + img +')',
          'background-size': attrs.photosize ? evalattr(attrs.photosize) : 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        });
      };

      const slickinit = (slick) => {
        loadbg(slick.$slides[0]);
        loadbg(slick.$slides[1]);
      };

      const slickbeforechange = (slick, current, next) => {
        loadbg(slick.$slides[current]);
        loadbg(slick.$slides[next]);
      };

      scope.refresh = refresh;
      scope.openslideshow = openslideshow;
      scope.slickinit = slickinit;
      scope.slickbeforechange = slickbeforechange;

      $timeout(refresh, 0);

      scope.$root.$watch('business', refresh);
      attrs.$observe('aid', refresh);
      attrs.$observe('serviceid', refresh);
      attrs.$observe('slidesetid', refresh);
      attrs.$observe('slideid', refresh);
      attrs.$observe('ratio', () => {
        scope.ratio = evalattr(attrs.ratio);
        safeApply(scope);
      });
      attrs.$observe('speed', () => {
        scope.speed = +evalattr(attrs.speed);
        safeApply(scope);
      });
      attrs.$observe('autoplayspeed', () => {
        scope.autoplayspeed = +evalattr(attrs.autoplayspeed);
        safeApply(scope);
      });
      attrs.$observe('zoomin', () => {
        scope.zoomin = !(!('zoomin' in attrs) || evalattr(attrs.zoomin) === 'false');
        safeApply(scope);
      });
      attrs.$observe('fade', () => {
        scope.fade = !(!('fade' in attrs) || evalattr(attrs.fade) === 'false');
        safeApply(scope);
      });
      attrs.$observe('dots', () => {
        scope.dots = !(!('dots' in attrs) || evalattr(attrs.dots) === 'false');
        safeApply(scope);
      });
      attrs.$observe('arrows', () => {
        scope.arrows = !(!('arrows' in attrs) || evalattr(attrs.arrows) === 'false');
        safeApply(scope);
      });
    }
  };
}];
