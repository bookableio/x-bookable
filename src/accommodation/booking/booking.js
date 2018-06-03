import bookable from 'bookable';
import moment from 'moment';

export default ['safeApply', '$timeout', 'event', 'evalattr', 'scrollto', function(safeApply, $timeout, event, evalattr, scrollto) {
  return {
    template: require('./booking.html'),
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

          scope.maximum = (() => {
            let max = 0;
            (accommodation.roomtypes || []).forEach(roomtype => {
              if( roomtype.maximum > max ) max = roomtype.maximum;
            });
            return max;
          })() || 1;

          safeApply(scope);
        });
      };

      const form = scope.form = {};

      const select = (date, rates, roomtype) => {
        if( !date || !rates ) return;
        if( !rates.bookable ) return;

        scope.checkin = date;
        scope.roomtypeid = roomtype && roomtype.id;

        form.checkin = moment(date).format('YYYY-MM-DD');
        form.days = 1;
        form.guests = 1;

        safeApply(scope, () => {
          scrollto(element[0].querySelector('#xbkb-finder'), 250);
        });

        event.fire(element, 'select', {
          date,
          rates,
          roomtype
        });
      };

      const find = () => {
        const form = scope.form;

        scope.checkin = form.checkin;
        scope.days = form.days;
        scope.guests = form.guests;
        delete scope.isbooknow;

        safeApply(scope);
      };

      const clear = () => {
        delete scope.isbooknow;
        delete scope.checkin;

        safeApply(scope, () => {
          scrollto(element[0].querySelector('#xbkb-calendar'), 250);
        });
      };

      const setrooms = (rooms) => {
        scope.rooms = rooms;
        safeApply(scope);
      };

      const setextraoptions = (extraoptions) => {
        scope.extraoptions = extraoptions;
        safeApply(scope);
      };

      const booknow = () => {
        scope.isbooknow = true;
        safeApply(scope);
      };

      const complete = (reservation) => {
        clear();

        attrs.ngComplete && scope.$parent.$eval(attrs.ngComplete, {$reservation: reservation});
        event.fire(element, 'complete', {reservation});
      };

      event.regist(element, attrs, 'select');

      attrs.$observe('showrates', () => {
        scope.showrates = 'showrates' in attrs && evalattr(attrs.showrates) !== 'false';
        safeApply(scope);
      });

      attrs.$observe('checkin', () => {
        scope.checkin = form.checkin = evalattr(attrs.checkin);
        if( scope.checkin ) form.checkin = moment(scope.checkin).format('YYYY-MM-DD');
        safeApply(scope);
      });

      attrs.$observe('checkout', () => {
        scope.checkout = evalattr(attrs.checkout);
        safeApply(scope);
      });

      attrs.$observe('days', () => {
        scope.days = form.days = +evalattr(attrs.days) || 1;
        safeApply(scope);
      });

      attrs.$observe('guests', () => {
        scope.guests = form.guests = +evalattr(attrs.guests) || 1;
        safeApply(scope);
      });

      attrs.$observe('roomtypeid', () => {
        scope.roomtypeid = evalattr(attrs.roomtypeid);
        safeApply(scope);
      });

      attrs.$observe('labelClosed', () => {
        scope.labelClosed = attrs.labelClosed;
      });


      scope.refresh = refresh;
      scope.select = select;
      scope.find = find;
      scope.clear = clear;
      scope.setrooms = setrooms;
      scope.setextraoptions = setextraoptions;
      scope.booknow = booknow;
      scope.complete = complete;

      $timeout(refresh, 0);
    }
  };
}];
