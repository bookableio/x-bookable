import angular from 'angular';
import bookable from 'bookable';
import {} from 'ng-apply';
import {} from 'ng-formatter';
import {} from 'ng-background';
import {} from 'ng-bootstrap-pagination';
import {} from 'ng-slick';
import {} from 'ng-incrementer';
import {} from 'ng-anticomposition';
import {} from 'ng-flatpickr';

import roompic from './util/roompic';
import range from './util/range';
import tobr from './util/tobr';
import cdn from './util/cdn';
import basename from './util/basename';
import parsequery from './util/parse-query';

import service_evalattr from './service/evalattr/evalattr';
import service_event from './service/event/event';
import service_slideshow from './service/slideshow/slideshow';
import service_staged from './service/staged/staged';
import service_scrollto from './service/scrollto/scrollto';
import common_fclick from './common/fclick/fclick';
import common_info from './common/info/info';

import directives from './directives';

bookable.info().exec();

const app = angular.module('bookable', ['ngApply', 'ngFormatter', 'ngBackground', 'ngBootstrapPagination', 'ngSlick', 'ngIncrementer', 'ngAntiComposition', 'ngFlatpickr'])
  .filter('unsafe', ['$sce', $sce => $sce.trustAsHtml])
  .filter('tobr', () => tobr)
  .filter('range', () => range)
  .filter('cdn', () => cdn)
  .filter('roompic', () => roompic)
  .service('evalattr', service_evalattr)
  .service('evalattr', service_evalattr)
  .service('event', service_event)
  .service('slideshow', service_slideshow)
  .service('staged', service_staged)
  .service('scrollto', service_scrollto)
  .run(['$rootScope', 'safeApply', function(scope, safeApply) {
    // util
    scope.$query = parsequery;
    scope.$hash = () => location.hash.substring(1);
    scope.$basename = basename;

    bookable.info().exec((err, business) => safeApply(scope, () => scope.business = business));
  }])
  .directive('ngFclick', common_fclick)
  .directive('bInfo', common_info);

Object.keys(directives).forEach(key => app.directive(key, directives[key]));

export default app;
