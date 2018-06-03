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

        const limit = +scope.pagesize || 15;
        const groupid = scope.groupid;

        if( !groupid ) return;
        if( !attrs.groupid ) return;

        bookable.info({
          id: evalattr(attrs.aid),
          serviceid: evalattr(attrs.serviceid)
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          bookable.get(`/app/bbs/${accommodation.serviceid}/${groupid}`).localcache(1000).exec((err, dataset) => {
            if( err ) return error(err);

            bookable.get(`/app/bbs/${accommodation.serviceid}/${groupid}/data`, {
              offset: +offset || 0,
              limit
            }).localcache(1000).exec((err, list) => {
              if( err ) return error(err);

              scope.accommodation = accommodation;
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

        event.fire(element, 'select', {
          article,
          dataset
        });

        if( dataset.listingtype !== 'faq' ) {
          event.fire(element, 'detail', {
            article,
            dataset
          });
        }
      };

      const articleno = index => {
        const paging = scope.paging;
        if( !paging ) return;

        const total = +paging.total || 0;
        const offset = +paging.offset || 0;
        const limit = Math.min(+paging.limit, total);
        const current = (Math.floor(offset / limit) + 1) || 1;
        const set_index = Math.floor((current - 1) / limit) + 1;
        const setlastindex = (set_index * limit);

        return setlastindex - index;
      };

      attrs.$observe('buttonLabel', () => {
        scope.buttonLabel = evalattr(attrs.buttonLabel);
        safeApply(scope);
      });

      attrs.$observe('listingtype', () => {
        scope.listingtype = evalattr(attrs.listingtype);
        safeApply(scope);
      });

      attrs.$observe('paging', () => {
        scope.usePaging = evalattr(attrs.paging) !== 'false' && true;
        safeApply(scope);
      });

      attrs.$observe('pagesize', () => {
        scope.pagesize = +evalattr(attrs.pagesize) || 15;
        scope.groupid && refresh();
      });

      attrs.$observe('groupid', () => {
        scope.groupid = evalattr(attrs.groupid);
        refresh();
      });

      attrs.$observe('articleid', () => {
        scope.articleid = evalattr(attrs.articleid);
        safeApply(scope);
      });

      event.regist(element, attrs, 'select');
      event.regist(element, attrs, 'detail');

      attrs.$observe('col', () => safeApply(scope, () => scope.col = +evalattr(attrs.col)));
      attrs.$observe('colxs', () => safeApply(scope, () => scope.colxs = +evalattr(attrs.colxs)));
      attrs.$observe('colsm', () => safeApply(scope, () => scope.colsm = +evalattr(attrs.colsm)));
      attrs.$observe('colmd', () => safeApply(scope, () => scope.colmd = +evalattr(attrs.colmd)));
      attrs.$observe('collg', () => safeApply(scope, () => scope.collg = +evalattr(attrs.collg)));

      scope.refresh = refresh;
      scope.select = select;
      scope.articleno = articleno;
      scope.usePaging = true;

      $timeout(refresh, 0);
    }
  };
}];
