import bookable from 'bookable';

export default ['safeApply', '$timeout', 'event', 'evalattr', function(safeApply, $timeout, event, evalattr) {
  return {
    template: require('./article.html'),
    replace: true,
    scope: {
    },
    restrict: 'E',
    link(scope, element, attrs) {
      const error = (error) => {
        console.error(error);
        scope.error = error;
        safeApply(scope);
      };

      const refresh = () => {
        const groupid = evalattr(attrs.groupid);
        const articleid = evalattr(attrs.articleid);

        if( !groupid || !articleid ) {
          scope.loaded = true;
          return;
        }

        bookable.info({
          id: attrs.aid,
          serviceid: attrs.serviceid
        }).exec((err, accommodation) => {
          if( err ) return error(err);
          if( !accommodation ) return error(new Error('서비스를 찾을 수 없습니다.'));

          bookable.get(`/app/bbs/${accommodation.serviceid}/${groupid}/data/${articleid}`).localcache(1000).exec((err, article) => {
            if( err ) return error(err);
            if( !article ) return error(new Error('게시물을 찾을 수 없습니다. : ' + groupid + '/' + articleid));

            scope.article = article;
            scope.loaded = true;
            safeApply(scope);
          });
        });
      };

      attrs.$observe('buttonLabel', () => {
        scope.buttonLabel = evalattr(attrs.buttonLabel);
        safeApply(scope);
      });

      attrs.$observe('viewStyle', () => {
        scope.viewStyle = evalattr(attrs.viewStyle);
        safeApply(scope);
      });

      attrs.$observe('groupid', () => refresh());
      attrs.$observe('articleid', () => refresh());

      scope.buttonLabel = attrs.buttonLabel;
      scope.refresh = refresh;

      element[0].refresh = refresh;

      $timeout(refresh, 0);
    }
  };
}];
