import bookable from 'bookable';
import moment from 'moment';

export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    require: '?ngModel',
    replace: true,
    scope: {
      ngModel: '='
    },
    restrict: 'E',
    template: require('./calendar-roomtype.html'),
    link(scope, element, attrs) {
      const today = moment(moment().format('YYYYMMDD'), 'YYYYMMDD');
      let cdate = moment().startOf('month');

      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          scope.year = cdate.year();
          scope.month = cdate.month() + 1;

          const endofmonth = cdate.clone().endOf('month');
          const startdate = cdate.clone().add(-cdate.day(), 'days');
          const enddate = endofmonth.clone().add(6 - endofmonth.day(), 'days');

          bookable.accommodation(accommodation.id).rates.rates({
            startdate: startdate.format('YYYYMMDD'),
            enddate: enddate.format('YYYYMMDD')
          }).exec((err, rates) => {
            if( err ) return error(err);

            const days = [];
            const iter = startdate.clone();
            const datemap = {};

            do {
              days.push(datemap[iter.format('YYYYMMDD')] = {
                date: iter.format('YYYYMMDD'),
                year: iter.year(),
                month: iter.month() + 1,
                day: iter.date(),
                dayofweek: iter.day(),
                pastdate: +today.format('YYYYMMDD') > +iter.format('YYYYMMDD'),
                today: iter.format('YYYYMMDD') === today.format('YYYYMMDD'),
                prevmonth: (cdate.year() * 100) + cdate.month() > (iter.year() * 100) + iter.month(),
                nextmonth: (cdate.year() * 100) + cdate.month() < (iter.year() * 100) + iter.month()
              });
            } while(iter.add(1, 'days').diff(enddate) <= 0);

            const weeks = [];
            for (let i = 0; i < days.length; i++ ) {
              if (i % 7 === 0) weeks.push([]);
              weeks[weeks.length-1].push(days[i]);
            }

            scope.accommodation = accommodation;
            scope.weeks = weeks;
            scope.datemap = datemap;
            scope.rates = rates;
            scope.ready = true;

            rates.rates.forEach((rates) => {
              datemap[rates.date].rates = rates;
            });

            safeApply(scope);
          });
        });
      };

      const prevmonth = () => {
        cdate.add(-1, 'month');
        refresh();
      };

      const nextmonth = () => {
        cdate.add(1, 'month');
        refresh();
      };

      const currentmonth = () => {
        cdate = moment().startOf('month');
        refresh();
      };

      const select = (day, roomtype) => {
        if( !day || !roomtype ) return;
        if( !day.rates.bookable ) return;
        if( !day.rates.rates[roomtype.id] ) return;

        const date = day.date;
        const rates = day.rates.rates[roomtype.id];

        event.fire(element, 'select', {
          date,
          rates,
          roomtype
        });
      };

      const statuslabel = (rates) => {
        if( !rates || !rates.bookable ) return '불가';
        return '가능';
      };

      event.regist(element, attrs, 'select');

      scope.refresh = refresh;
      scope.prevmonth = prevmonth;
      scope.nextmonth = nextmonth;
      scope.currentmonth = currentmonth;
      scope.select = select;
      scope.statuslabel = statuslabel;
      scope.labelClosed = evalattr(attrs.labelClosed) || '예약마감';

      attrs.$observe('serviceid', () => {
        refresh();
      });

      attrs.$observe('showrates', () => {
        scope.showrates = 'showrates' in attrs && evalattr(attrs.showrates) !== 'false';
        safeApply(scope);
      });

      attrs.$observe('labelClosed', () => {
        scope.labelClosed = evalattr(attrs.labelClosed) || '예약마감';
      });

      $timeout(refresh, 0);
    }
  };
}];
