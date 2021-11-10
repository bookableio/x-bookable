import xmodal from 'x-modal';
import bookable from 'bookable';
import cart from '../cart.js';

export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    require: '?ngModel',
    template: require('./cart.html'),
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

      const sortrooms = () => {
        const accommodation = scope.accommodation;
        const reservation = scope.reservation;
        const sortedrooms = reservation.roomtypes = [];

        (accommodation.roomtypes || []).forEach((roomtype) => {
          const roomtypeinfo = {
            id: roomtype.id,
            name: roomtype.name,
            name_en: roomtype.name_en,
            thumbnail: roomtype.thumbnail,
            photo: roomtype.photo,
            desc: roomtype.desc,
            maximum: roomtype.maximum,
            totalprice: 0,
            rooms: []
          };

          sortedrooms[roomtype.id] = roomtypeinfo;
          sortedrooms.push(roomtypeinfo);
        });

        reservation.rooms.forEach((room) => {
          const roomtypeinfo = sortedrooms[room.id];
          if( !roomtypeinfo ) return console.warn('roomtype not exists:' + room.id);
          roomtypeinfo.rooms.push(room);
          roomtypeinfo.totalprice += room.price;
        });

        sortedrooms.forEach((roomtypeinfo) => {
          roomtypeinfo.rooms.sort((a,b) => a.date > b.date);
        });

        safeApply(scope);
      };

      const validation = () => {
        const accommodation = scope.accommodation;
        const reservation = scope.reservation;

        bookable.accommodation(accommodation.id).reservation.validate(reservation).exec((err, reservation) => {
          if( err ) return error(err);
          if( !reservation ) return error(new Error('reservation validation failure'));

          scope.reservation = reservation;

          sortrooms();
        });
      };

      const refresh = () => {
        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('accommodation not found'));

          scope.accommodation = accommodation;
          scope.reservation = {
            aid: accommodation.id,
            rooms: cart.rooms,
            roomtypes: []
          };

          validation();
        });
      };

      const remove = (target) => {
        xmodal.confirm('취소하시겠습니까?', (b) => {
          if( !b ) return;

          const reservation = scope.reservation;
          if( !reservation ) return;

          reservation.rooms.forEach((room) => {
            if( room === target ) reservation.rooms.splice(reservation.rooms.indexOf(room), 1);
          });

          reservation.roomtypes.forEach((roomtype) => {
            roomtype.rooms.forEach((room) => {
              if( room === target ) roomtype.rooms.splice(roomtype.rooms.indexOf(room), 1);
            });
          });

          cart.rooms = reservation.rooms;
          cart.save();

          xmodal.success('취소되었습니다.');
          refresh();
        });
      };

      const removeall = () => {
        xmodal.confirm('모두 취소하시겠습니까?', (b) => {
          if( !b ) return;

          cart.rooms = [];
          cart.save();

          xmodal.success('취소되었습니다.');
          refresh();
        });
      };

      /*const save = () => {
        if( !scope.accommodation ) return;

        const saveTo = attrs.saveTo;

        if( saveTo ) {
          if( saveTo === '$form' ) {
            const clearcart = 'clearCart' in attrs && attrs.clearCart !== false;
            if( clearcart ) cart.clear();

            cart.merge(rooms);
            cart.save();
          } else {
            const nodes = document.querySelectorAll(connect);
            [].forEach.call(nodes, (node) => {
              const directive = angular.element(node).isolateScope();
              directive && directive.setrooms && directive.setrooms(rooms);
            });
          }
        }

        safeApply(scope);
      };*/

      scope.refresh = refresh;
      scope.validation = validation;
      scope.sortrooms = sortrooms;
      scope.remove = remove;
      scope.removeall = removeall;

      $timeout(refresh, 0);
    }
  };
}];
