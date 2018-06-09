import angular from 'angular';
import xmodal from 'x-modal';
import bookable from 'bookable';
import cart from '../cart';

export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    require: '?ngModel',
    template: require('./bookaroom.html'),
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

      const min = (a, b) => {
        if( typeof a !== 'number' || isNaN(a) ) {
          if( typeof b !== 'number' || isNaN(b) ) return null;
          return b;
        }

        if( a > b ) return b;
        else if( b > a ) return a;
        return a;
      };

      const calc = () => {
        const summary = scope.summary;
        summary.valid = true;
        summary.adults = +summary.adults || 0;
        summary.children = +summary.children || 0;
        summary.qty = +summary.qty || 1;
        summary.days = scope.selected.length;

        summary.capacity = null;
        summary.vacancy = null;
        summary.maximum = null;

        summary.roomcharge = 0;
        summary.extracharge = 0;
        summary.price = 0;

        const rooms = [];
        scope.selected.sort((a, b) => a.date - b.date).forEach((roomrates) => {
          let extracharge = 0;
          const person = summary.adults + summary.children;
          if( roomrates.capacity < person ) {
            const exadults = summary.adults - roomrates.capacity;
            if( exadults > 0 ) {
              extracharge += exadults * roomrates.extrapersoncharge;
              extracharge += summary.children * roomrates.extrachildcharge;
            } else {
              extracharge += (person - roomrates.capacity) * roomrates.extrachildcharge;
            }
          }

          summary.capacity = min(summary.capacity, roomrates.capacity);
          summary.vacancy = min(summary.vacancy, roomrates.vacancy);
          summary.maximum = min(summary.maximum, roomrates.maximum);
          summary.roomcharge += (roomrates.price * summary.qty);
          summary.extracharge += extracharge * summary.qty;
          summary.price += ((roomrates.price + extracharge) * summary.qty);

          roomrates.qty = summary.qty;
          roomrates.adults = summary.adults;
          roomrates.children = summary.children;
          roomrates.calcprice = ((roomrates.price + extracharge) * summary.qty);

          rooms.push({
            id: roomrates.roomtypeid,
            date: roomrates.date,
            qty: summary.qty,
            adults: summary.adults,
            children: summary.children
          });
        });

        if( summary.price <= 0 ) summary.valid = false;
        if( summary.adults <= 0 ) summary.valid = false;

        scope.summary = summary;
        scope.rooms = rooms;

        safeApply(scope);
      };

      const refresh = () => {
        if( !scope.roomtypeid ) return;

        delete scope.loaded;
        delete scope.error;

        scope.summary = {
          valid: false,
          qty: 1,
          adults: 0,
          children: 0
        };

        scope.selected = [];

        bookable.info({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.accommodation = accommodation;
          scope.roomtype = accommodation && accommodation.roomtypes.find(roomtype => roomtype.id === scope.roomtypeid);
          scope.loaded = true;
          safeApply(scope);
        });
      };

      const deselect = (date) => {
        const selected = scope.selected;
        selected.forEach((rates) => {
          if( rates.date === date ) selected.splice(selected.indexOf(rates), 1);
        });

        if( !selected.length ) scope.isbooknow = false;
        calc();
      };

      const select = (rates) => {
        if( !rates ) return console.warn('missing arguments:rates');

        deselect(rates.date);
        const roomrates = rates.rates[scope.roomtypeid];
        scope.selected.push({
          roomtypeid: roomrates.roomtypeid,
          date: rates.date,
          qty: 1,
          adults: 1,
          children: 1,
          bookable: roomrates.bookable,
          vacancy: roomrates.vacancy,
          price: roomrates.price,
          capacity: roomrates.capacity,
          maximum: roomrates.maximum,
          extrachildcharge: roomrates.extrachildcharge,
          extrapersoncharge:roomrates.extrapersoncharge,
          listprice: roomrates.listprice,
          discount: roomrates.discount,
          booked: roomrates.booked
        });
        calc();
      };

      const clear = () => {
        scope.selected = [];
        const cscope = angular.element(element[0].querySelector('.x-bookaroom-calendar')).isolateScope();
        cscope && cscope.clear();
        const fscope = angular.element(element[0].querySelector('.x-bookaroom-form')).isolateScope();
        fscope && fscope.clear();
        safeApply(scope);
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

      const booknow = () => {
        if( !scope.selected.length )
          return xmodal.error('예약할 날짜를 선택해주세요.');
        if( scope.summary.adults <= 0 )
          return xmodal.error('인원수를 입력해주세요.');

        scope.isbooknow = true;
        safeApply(scope);
      };

      const complete = (reservation) => {
        clear();

        attrs.ngComplete && scope.$parent.$eval(attrs.ngComplete, {$reservation: reservation});
        event.fire(element, 'complete', {reservation});
      };

      const setextraoptions = (extraoptions) => {
        scope.extraoptions = extraoptions;
        safeApply(scope);
      };

      const isavailable = () => {
        const summary = scope.summary;
        const selected = scope.selected;
        return selected && summary && (!selected.length || !summary.price || !+summary.adults);
      };

      scope.initialmessage = attrs.initialMessage;
      scope.roomtypeid = evalattr(attrs.roomtypeid);

      scope.refresh = refresh;
      scope.select = select;
      scope.deselect = deselect;
      scope.calc = calc;
      scope.savetocart = savetocart;
      scope.booknow = booknow;
      scope.clear = clear;
      scope.complete = complete;
      scope.setextraoptions = setextraoptions;
      scope.isavailable = isavailable;

      scope.$watch(() => evalattr(attrs.roomtypeid), (value) => {
        if( !value || scope.roomtypeid === value ) return;
        scope.roomtypeid = value;
        refresh();
      }, true);

      attrs.$observe('useCart', () => {
        scope.useCart = 'useCart' in attrs && evalattr(attrs.useCart) !== 'false';
        safeApply(scope);
      });

      attrs.$observe('showDetail', () => {
        scope.showDetail = 'showDetail' in attrs && attrs.showDetail !== 'false';
        safeApply(scope);
      });

      event.regist(element, attrs, 'cart');
      event.regist(element, attrs, 'complete');

      $timeout(refresh, 0);
    }
  };
}];
