import moment from 'moment';
import xmodal from 'x-modal';
import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', 'evalattr', 'staged', function(safeApply, $timeout, event, evalattr, staged) {
  return {
    template: require('./finder.html'),
    replace: true,
    restrict: 'E',
    scope: {},
    link(scope, element, attrs) {
      const error = (error) => {
        xmodal.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const calc = (roomrates) => {
        if( !roomrates ) return;

        let extracharge = 0;
        const person = roomrates.adults + roomrates.children;
        if( roomrates.capacity < person ) {
          const exadults = roomrates.adults - roomrates.capacity;
          if( exadults > 0 ) {
            extracharge += exadults * roomrates.extrapersoncharge;
            extracharge += roomrates.children * roomrates.extrachildcharge;
          } else {
            extracharge += (person - roomrates.capacity) * roomrates.extrachildcharge * roomrates.qty;
          }

          roomrates.extracharge = extracharge;
        } else {
          roomrates.extracharge = 0;
        }

        return roomrates.calcprice = (roomrates.price + roomrates.extracharge) * roomrates.qty;
      };

      const applychanges = () => {
        if( !scope.accommodation ) return;
        if( !scope.bookable ) return;

        //const saveTo = attrs.saveTo;
        const rooms = [];
        const bookable = scope.bookable;
        const selected = scope.selected || [];
        let totalprice = 0;

        bookable.rates.forEach((roomrates) => {
          if( !~selected.indexOf(roomrates.id) ) return;
          if( !roomrates.checkin ) return console.error('missing checkin in roomrates', roomrates);
          if( !roomrates.checkout ) return console.error('missing checkout in roomrates', roomrates);
          if( !moment(roomrates.checkin).isValid() ) return console.error('roomrates has invalid checkin', roomrates);
          if( !moment(roomrates.checkout).isValid() ) return console.error('roomrates has invalid checkout', roomrates);

          const checkin = moment(roomrates.checkin);
          const checkout = moment(roomrates.checkout);
          const iter = checkin.clone();
          const calcprice = calc(roomrates);

          totalprice += calcprice;

          do {
            rooms.push({
              id: roomrates.id,
              date: iter.format('YYYYMMDD'),
              adults: +roomrates.adults || 1,
              children: +roomrates.children || 0,
              qty: roomrates.qty
            });
          } while(iter.add(1, 'days').diff(checkout) < 0);
        });

        scope.rooms = rooms;
        scope.totalprice = totalprice;

        event.fire(element, 'update', {
          rooms,
          totalprice,
          selected
        });

        safeApply(scope);
      };

      const refresh = () => {
        if( !staged(element) ) return;
        if( !scope.checkin ) return;

        const checkin = moment(scope.checkin);
        const checkout = scope.checkout ? moment(scope.checkout) : checkin.clone().add(+scope.days || 1, 'days');
        const guests = +scope.guests || 1;

        if( !checkin.isValid() ) return console.error('invalid checkin date:' + scope.checkin);

        delete scope.loaded;

        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return;

          bookable.accommodation(accommodation.id).rates.bookable({
            checkin: checkin.format('YYYY-MM-DD'),
            checkout: checkout.format('YYYY-MM-DD'),
            guests
          }).exec((err, bookable) => {
            if( err ) return error(err);

            scope.ready = true;
            scope.loaded = true;
            scope.accommodation = accommodation;
            scope.bookable = bookable;

            bookable.rates.forEach((roomrates) => {
              roomrates.adults = 1;
              roomrates.children = 0;
              roomrates.qty = 1;
            });

            applychanges();
          });
        });
      };

      const select = (roomtypeid) => {
        if( !roomtypeid ) return;

        const selected = scope.selected = scope.selected || [];
        if( ~selected.indexOf(roomtypeid) ) return;

        selected.push(roomtypeid);
        applychanges();
      };

      const deselect = (roomtypeid) => {
        if( !roomtypeid ) return;

        const selected = scope.selected;
        if( !selected || !~selected.indexOf(roomtypeid) ) return;

        selected.splice(selected.indexOf(roomtypeid), 1);
        applychanges();
      };

      const clearselect = () => {
        scope.selected = [];
        applychanges();
      };

      const toggleselect = (roomtypeid) => {
        if( !roomtypeid ) return;
        if( scope.selected && ~scope.selected.indexOf(roomtypeid) ) return deselect(roomtypeid);
        select(roomtypeid);
      };

      const isselected = (roomtypeid) => {
        if( !scope.selected ) return false;
        return !!~scope.selected.indexOf(roomtypeid);
      };

      const find = (options) => {
        if( !options ) return console.error('missing options');
        if( !options.accommodation ) return console.error('missing options.accommodation');
        if( !options.checkin ) return console.error('missing options.checkin');
        if( !options.checkout ) return console.error('missing options.checkout');

        scope.accommodation = options.accommodation;
        scope.checkin = options.checkin;
        scope.checkout = options.checkout;
        scope.guests = options.guests;
        scope.roomtypeid = options.roomtypeid;

        refresh();
      };

      const updateoptions = () => {
        applychanges();
      };

      scope.refresh = refresh;
      scope.calc = calc;
      scope.select = select;
      scope.deselect = deselect;
      scope.toggleselect = toggleselect;
      scope.clearselect = clearselect;
      scope.isselected = isselected;
      scope.find = find;
      scope.applychanges = applychanges;
      scope.updateoptions = updateoptions;

      event.regist(element, attrs, 'selectionchange');

      attrs.$observe('checkin', () => {
        scope.checkin = evalattr(attrs.checkin);
        refresh();
      });

      attrs.$observe('days', () => {
        scope.days = +evalattr(attrs.days) || 1;
        refresh();
      });

      attrs.$observe('checkout', () => {
        scope.checkout = evalattr(attrs.checkout);
        refresh();
      });

      attrs.$observe('guests', () => {
        scope.guests = +evalattr(attrs.guests) || 1;
        refresh();
      });

      attrs.$observe('roomtypeid', () => {
        clearselect();
        select(evalattr(attrs.roomtypeid));
      });

      attrs.$observe('initialmessage', () => {
        scope.initialmessage = evalattr(attrs.initialMessage);
        safeApply(scope);
      });

      $timeout(refresh, 0);
    }
  };
}];
