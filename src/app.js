import angular from 'angular';
import $ from 'jquery';
import bookable from 'bookable';
import {} from 'ng-apply';
import {} from 'ng-formatter';
import {} from 'ng-background';
import ngbootstrappagination from 'ng-bootstrap-pagination';
import {} from 'ng-slick';
import {} from 'ng-incrementer';
import {} from 'ng-anticomposition';
import {} from 'ng-flatpickr';

import meta from './util/meta';
import roompic from './util/roompic';
import range from './util/range';
import tobr from './util/tobr';
import cdn from './util/cdn';
import threshold from './util/threshold';
import basename from './util/basename';
import parsequery from './util/parse-query';
import ellipsis from './util/ellipsis';

import service_evalattr from './service/evalattr/evalattr';
import service_event from './service/event/event';
import service_slideshow from './service/slideshow/slideshow';
import service_staged from './service/staged/staged';
import service_scrollto from './service/scrollto/scrollto';
import common_fclick from './misc/fclick/fclick';
import common_info from './misc/info/info';
import common_href from './misc/info/href';
import common_if from './misc/info/if';
import common_bbs_if from './misc/info/bbs-if';
import common_bbs_exists from './misc/info/bbs-exists';
import common_copyright from './misc/info/copyright';

import directives from './directives';
import EventEmitter from './util/eventemitter';

const emitter = new EventEmitter();
const autoload = meta('bookable.autoload', '').toLowerCase().trim() !== 'false';

autoload && bookable.info().exec();

ngbootstrappagination.defaults({
  firstText: '처음',
  prevText: '<i class="icon-chevron-left"></i>',
  nextText: '<i class="icon-chevron-right"></i>',
  lastText: '마지막'
});

const app = angular.module('bookable', ['ngApply', 'ngFormatter', 'ngBackground', 'ngBootstrapPagination', 'ngSlick', 'ngIncrementer', 'ngAntiComposition', 'ngFlatpickr'])
  .filter('unsafe', ['$sce', $sce => $sce.trustAsHtml])
  .filter('unsafeurl', ['$sce', $sce => $sce.trustAsResourceUrl])
  .filter('tobr', () => tobr)
  .filter('range', () => range)
  .filter('cdn', () => cdn)
  .filter('roompic', () => roompic)
  .filter('ellipsis', () => ellipsis)
  .service('evalattr', service_evalattr)
  .service('evalattr', service_evalattr)
  .service('event', service_event)
  .service('slideshow', service_slideshow)
  .service('staged', service_staged)
  .service('scrollto', service_scrollto)
  .service('threshold', () => threshold)
  .run(['$rootScope', 'safeApply', 'evalattr', function(scope, safeApply, evalattr) {
    let loaded = false;
    const body = $(document.body);
    const load = () => {
      bookable.info().exec((err, business) => {
        if( err ) console.info('[bookable] ' + err.message);

        err && body.addClass('bookable-load-error');
        body.addClass('bookable-loaded');

        scope.loaderror = err;
        scope.business = business;
        loaded = true;

        document.title = document.title || business.title || business.name;

        scope.$emit('bookableloaded', business);
        emitter.fire('load', {
          business
        });

        safeApply(scope);
      });
    };

    const ensurebusiness = (options) => {
      if( options && options.id ) options.id = evalattr(options.id);
      if( options && options.serviceid ) options.serviceid = evalattr(options.serviceid);

      const business = scope.business;
      if( !loaded || !business ) return bookable.info(options);
      if( business && (options.id || options.serviceid) && options.id !== business.id && options.serviceid !== business.serviceid ) return bookable.info(options);

      return {
        exec: fn => fn(scope.loaderror, scope.business)
      };
    };

    autoload && load();

    // root scope
    scope.autoload = autoload;
    scope.load = load;
    scope.ensurebusiness = ensurebusiness;
    scope.$query = parsequery;
    scope.$hash = () => location.hash.substring(1);
    scope.$basename = basename;
  }])
  .directive('ngFclick', common_fclick)
  .directive('bIf', common_if)
  .directive('bookableIf', common_if)
  .directive('bInfo', common_info)
  .directive('bookableInfo', common_info)
  .directive('bHref', common_href)
  .directive('bookableHref', common_href)
  .directive('bBbsIf', common_bbs_if)
  .directive('bookableBbsIf', common_bbs_if)
  .directive('bBbsExists', common_bbs_exists)
  .directive('bookableBbsExists', common_bbs_exists)
  .directive('bCopyright', common_copyright)
  .directive('bookableCopyright', common_copyright);

Object.keys(directives).forEach(key => app.directive(key, directives[key]));

export default app;
export {emitter};
