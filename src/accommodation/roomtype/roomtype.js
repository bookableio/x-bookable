import $ from 'jquery';

export default ['safeApply', '$timeout', 'event', 'staged', 'evalattr', function(safeApply, $timeout, event, staged, evalattr) {
  return {
    template: require('./roomtype.html'),
    replace: true,
    scope: {},
    restrict: 'E',
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        const roomtypeid = evalattr(attrs.roomtypeid);
        if( !roomtypeid ) return;

        scope.$root.ensurebusiness({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, business) => {
          if( err ) return error(err);
          if( !business ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = business;
          scope.roomtype = (business.roomtypes || []).find(roomtype => roomtype.id === roomtypeid);

          $('[bookable-roomtype-info]').each((index, node) => {
            const value = node.getAttribute('bookable-roomtype-info');
            if( value ) node.innerHTML = scope.$eval(value) || '';
          });

          safeApply(scope);
        });
      };

      scope.refresh = refresh;

      scope.$root.$watch('business', refresh);
      attrs.$observe('aid', refresh);
      attrs.$observe('serviceid', refresh);

      attrs.$observe('roomtypeid', refresh);

      $timeout(refresh, 0);
    }
  };
}];
