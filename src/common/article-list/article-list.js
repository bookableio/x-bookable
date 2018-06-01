import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', 'evalattr', 'staged', function(safeApply, $timeout, event, evalattr, staged) {
  return {
    require: '?ngModel',
    template: require('./article-list.html'),
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

      const refresh = (offset) => {
        if( !staged(element) ) return;
        if( !attrs.datasetid ) return;

        bookable.info({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          bookable.get('/app/bbs/' + accommodation.serviceid + '/' + evalattr(attrs.datasetid)).localcache(1000).exec((err, dataset) => {
            if( err ) return error(err);

            const limit = +scope.pagesize || 15;
            bookable.get('/app/bbs/' + accommodation.serviceid + '/' + evalattr(attrs.datasetid) + '/data', {
              offset: +offset || 0,
              limit
            }).localcache(1000).exec((err, list) => {
              if( err ) return error(err);

              scope.dataset = dataset;
              scope.list = list;
              scope.listingtype = evalattr(attrs.listingtype) || dataset.listingtype;
              scope.paging = {
                total: list.total,
                offset: list.offset,
                limit,
                go(index) {
                  refresh((index * limit) - limit);
                }
              };

              safeApply(scope);
            });
          });
        });
      };

      const select = (article) => {
        if( scope.selected && scope.selected.id === article.id ) scope.selected = null;
        else scope.selected = article;
        safeApply(scope);

        const dataset = scope.dataset;
        attrs.ngSelect && scope.$parent.$eval(attrs.ngSelect, {$article: article});

        event.fire(element, 'select', {
          article,
          dataset
        });

        if( dataset.listingtype !== 'faq' ) {
          event.fire(element, 'view', {
            article,
            dataset
          });
        }
      };

      attrs.$observe('buttonLabel', () => {
        scope.buttonLabel = evalattr(attrs.buttonLabel);
        safeApply(scope);
      });

      attrs.$observe('listingtype', () => {
        scope.listingtype = evalattr(attrs.listingtype);
        safeApply(scope);
      });

      attrs.$observe('pagesize', () => {
        scope.pagesize = attrs.pagesize;
        attrs.datasetid && refresh();
      });

      attrs.$observe('paging', () => {
        scope.usePaging = evalattr(attrs.paging) !== 'false' && true;
        safeApply(scope);
      });

      event.regist(element, attrs, 'select');
      event.regist(element, attrs, 'view');

      attrs.$observe('col', () => safeApply(scope, () => scope.col = +evalattr(attrs.col)));
      attrs.$observe('colxs', () => safeApply(scope, () => scope.colxs = +evalattr(attrs.colxs)));
      attrs.$observe('colsm', () => safeApply(scope, () => scope.colsm = +evalattr(attrs.colsm)));
      attrs.$observe('colmd', () => safeApply(scope, () => scope.colmd = +evalattr(attrs.colmd)));
      attrs.$observe('collg', () => safeApply(scope, () => scope.collg = +evalattr(attrs.collg)));

      scope.buttonLabel = evalattr(attrs.buttonLabel);
      scope.pagesize = 15;
      scope.refresh = refresh;
      scope.select = select;

      $timeout(refresh, 0);
    }
  };
}];
