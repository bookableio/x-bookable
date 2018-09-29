import bookable from 'bookable';
import moment from 'moment';
import xmodal from 'x-modal';
import cart from '../cart';

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
        form.guests = 0;

        safeApply(scope);

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

        safeApply(scope);
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
        safeApply(scope, () => {
          scrollto(element[0].querySelector('#xbkb-form'), 250);
        });
      };

      const complete = (reservation) => {
        clear();
        event.fire(element, 'complete', {reservation});
      };

      const savetocart = () => {
        if( !scope.selected.length )
          return xmodal.error('예약할 날짜를 선택해주세요.');
        if( scope.summary.adults <= 0 )
          return xmodal.error('인원수를 입력해주세요.');

        const rooms = scope.rooms;

        xmodal.confirm('장바구니에 추가하시겠습니까?', (b) => {
          if( !b ) return;

          cart.merge(rooms);
          cart.save();

          safeApply(scope);
          event.fire(element, 'cart', {rooms});

          const carthref = attrs.cartHref;
          if( !carthref ) return xmodal.success('장바구니에 추가되었습니다.');

          xmodal.confirm('장바구니를 확인하시겠습니까?', (b) => {
            if( b ) location.href = carthref;
            clear();
          });
        });
      };

      event.regist(element, attrs, 'select');
      event.regist(element, attrs, 'complete');

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
        scope.guests = form.guests = +evalattr(attrs.guests) || 0;
        safeApply(scope);
      });

      attrs.$observe('roomtypeid', () => {
        scope.roomtypeid = evalattr(attrs.roomtypeid);
        safeApply(scope);
      });

      attrs.$observe('labelClosed', () => {
        scope.labelClosed = attrs.labelClosed;
      });

      attrs.$observe('useCart', () => {
        scope.useCart = 'useCart' in attrs && evalattr(attrs.useCart) !== 'false';
        safeApply(scope);
      });


      scope.refresh = refresh;
      scope.select = select;
      scope.find = find;
      scope.clear = clear;
      scope.setrooms = setrooms;
      scope.setextraoptions = setextraoptions;
      scope.booknow = booknow;
      scope.complete = complete;
      scope.savetocart = savetocart;

      $timeout(refresh, 0);
    }
  };
}];
