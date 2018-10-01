import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    template: require('./extra.html'),
    replace: true,
    restrict: 'E',
    scope: {},
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const applychanges = () => {
        if( !scope.accommodation ) return;

        const extraoptions = [];
        let totalprice = 0;
        scope.accommodation.extras.forEach(extra => {
          if( !+extra.qty ) return;

          const price = +(extra.price * extra.qty);
          extraoptions.push({
            id: extra.id,
            qty: extra.qty,
            price
          });

          if( price ) totalprice += price;
        });

        scope.extraoptions = extraoptions;
        scope.totalprice = totalprice;

        event.fire(element, 'update', {
          extraoptions,
          totalprice
        });

        safeApply(scope);
      };

      const refresh = () => {
        delete scope.ready;

        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);

          scope.ready = true;
          scope.accommodation = accommodation;

          safeApply(scope);
        });
      };

      const updateoptions = () => {
        applychanges();
      };

      scope.refresh = refresh;
      scope.applychanges = applychanges;
      scope.updateoptions = updateoptions;

      event.regist(element, attrs, 'selectionchange');

      $timeout(refresh, 0);
    }
  };
}];
