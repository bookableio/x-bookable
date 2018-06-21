import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', function(safeApply, $timeout, event) {
  return {
    template: require('./rates.html'),
    replace: true,
    restrict: 'E',
    scope: {},
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        delete scope.loaded;
        delete scope.error;

        bookable.info().exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = accommodation;
          scope.loaded = true;

          safeApply(scope);
        });
      };

      const select = roomtype => {
        event.fire(element, 'select', {roomtype});
      };

      const exists = key => !!(scope.accommodation.roomtypes || []).find(roomtype => roomtype.info && roomtype.info[key]);

      event.regist(element, attrs);

      scope.refresh = refresh;
      scope.select = select;
      scope.exists = exists;

      $timeout(refresh, 0);
    }
  };
}];
