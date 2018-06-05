import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', 'staged', 'evalattr', function(safeApply, $timeout, event, staged, evalattr) {
  return {
    template: require('./roomtype-name.html'),
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
        if( !roomtypeid || !staged(element) ) return;

        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.roomtype = (accommodation.roomtypes || []).find(roomtype => roomtype.id === roomtypeid);

          safeApply(scope);
        });
      };

      scope.refresh = refresh;

      attrs.$observe('serviceid', () => refresh);
      attrs.$observe('roomtypeid', () => refresh);

      $timeout(refresh, 0);
    }
  };
}];
