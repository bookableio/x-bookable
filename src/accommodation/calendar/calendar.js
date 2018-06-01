import bookable from 'bookable';
import moment from 'moment';

export default ['safeApply', '$timeout', 'event', 'evalattr', 'staged', function(safeApply, $timeout, event, evalattr, staged) {
  return {
    require: '?ngModel',
    replace: true,
    scope: {
      ngModel: '='
    },
    restrict: 'E',
    template: require('./calendar.html'),
    link(scope, element, attrs) {
      const today = moment(moment().format('YYYYMMDD'), 'YYYYMMDD');
      let cdate = moment().startOf('month');

      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        const roomtypeid = evalattr(attrs.roomtypeid);

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
            enddate: enddate.format('YYYYMMDD'),
            roomtypeid
          }).exec((err, rates) => {
            if( err ) return error(err);

            const days = [];
            const iter = startdate.clone();
            const datemap = {};
            const roomtype = accommodation.roomtypes.find(roomtype => roomtypeid === roomtype.id);

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
            scope.roomtype = roomtype;
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

      const select = (day) => {
        if( scope.disabled ) return;
        if( !day.rates.bookable ) return;

        const roomtype = scope.roomtype;
        const date = day.date;
        const rates = day.rates;
        let selected = scope.selected = scope.selected || [];

        if( !~selected.indexOf(date) ) {
          if( !scope.multiple ) selected = scope.selected = [];
          selected.push(date);

          event.fire(element, 'select', {
            date,
            rates,
            selected
          });
        } else {
          selected.splice(selected.indexOf(date), 1);

          event.fire(element, 'deselect', {
            date,
            rates,
            roomtype,
            selected
          });
        }

        event.fire(element, 'dateclick', {
          date,
          selected,
          rates,
          roomtype
        });

        event.fire(element, 'change', {
          selected,
          roomtype
        });
      };

      const isselected = (date) => {
        if( !scope.selected ) return false;
        return !!~scope.selected.indexOf(date);
      };

      const clear = () => {
        scope.selected = [];
        safeApply(scope);
      };

      event.regist(element, attrs, 'deselect');
      event.regist(element, attrs, 'change');
      event.regist(element, attrs, 'select');
      event.regist(element, attrs, 'dateclick');

      scope.refresh = refresh;
      scope.prevmonth = prevmonth;
      scope.nextmonth = nextmonth;
      scope.currentmonth = currentmonth;
      scope.select = select;
      scope.isselected = isselected;
      scope.clear = clear;

      attrs.$observe('serviceid', () => {
        refresh();
      });

      attrs.$observe('roomtypeid', () => {
        refresh();
      });

      attrs.$observe('dates', () => {
        let dates = evalattr(attrs.dates);
        dates = dates || '';
        dates = dates.split(',').map((date) => date && date.trim()).filter((date) => !!date && moment(date).isValid());

        console.log('dates', dates);
        scope.selected = dates;
      });

      attrs.$observe('multiple', () => {
        scope.multiple = 'multiple' in attrs && evalattr(attrs.multiple) !== 'false';
        safeApply(scope);
      });

      attrs.$observe('disabled', () => {
        scope.disabled = 'disabled' in attrs && evalattr(attrs.disabled) !== 'false';
        if( scope.disabled ) scope.selected = [];
        safeApply(scope);
      });

      $timeout(refresh, 0);
    }
  };
}];


/*attrs.$observe('ngSelected', () => {
  let selected = scope.$parent.$eval(attrs.ngSelected);
  if( !selected || !Array.isArray(selected) ) selected = [];
  let invalid = false;
  selected.forEach((date) => {
    if( typeof date !== 'string' && date.length !== 8 ) {
      console.warn('invalid value for selected', selected);
      invalid = true;
    }
  });
  if( !invalid ) scope.selected = selected;
  safeApply(scope);
});*/
