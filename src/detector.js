import angular from 'angular';
import series from 'async-each-series';
import meta from './util/meta';
import threshold from './util/threshold';
import directives from './directives';
import tokebobcase from './util/tokebobcase';

const doc = document;
const tags = Object.keys(directives).map(tokebobcase);

const execdetect = (force) => {
  const targets = [].slice.call(doc.querySelectorAll(tags.join(':not(.ng-scope),') + ',[b-info],[bookable-info],[b-if],[bookable-if],[bookable-bbs-if],[b-bbs-if]'));
  if( !force && !targets.length ) return;

  let rootnode = doc.querySelector('[ng-bookable]');

  if( !rootnode ) {
    rootnode = doc.createElement('div');
    rootnode.setAttribute('ng-bookable', '');
    rootnode.style.display = 'none';
    doc.body.appendChild(rootnode);
  }

  let injector = angular.element(rootnode).injector();
  if( !injector ) {
    angular.bootstrap(rootnode, ['bookable']);
    injector = angular.element(rootnode).injector();
  }

  angular.element(rootnode).injector().invoke(['$compile', '$rootScope', '$timeout', function(compile, rootscope, timeout) {
    series(targets, (target, done) => {
      if( ~target.className.indexOf('ng-scope') || !doc.body.contains(target) ) return done();

      compile(target)(rootscope);
      done();
    }, (err) => {
      if( err ) console.error(err);

      timeout(() => rootscope.$digest(), 0);
    });
  }]);
};

const execapply = () => {
  const rootnode = document.querySelector('[ng-app="bookable"]');
  const scope = rootnode && angular.element(rootnode).scope();
  if( !scope ) return;

  const phase = (scope.$root || scope).$$phase;
  if(phase === '$apply' || phase === '$digest') {
    scope.$eval();
  } else {
    scope.$apply();
  }
};

const detect = threshold(execdetect, 10);
const apply = threshold(execapply, 10);

const observer = {
  start() {
    if( !window.MutationObserver ) return console.warn('this browser does not support MutationObserver');

    observer.observer = new MutationObserver(() => {
      detect();
    });

    observer.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  stop() {
    observer.observer && observer.observer.disconnect();
    delete observer.observer;
  }
};

const _pushState = history.pushState;
const _hashchangelistener = () => {
  apply();
};

const start = () => {
  const ready = () => {
    // domready 시 mutation observer 시작
    meta('bookable.observer', '').toLowerCase() !== 'false' && window.MutationObserver && observer.start();

    // hash, history 변경시 $query 등 변경을 반영하기 위해 apply
    window.addEventListener('hashchange', _hashchangelistener, false);

    (function(history){
      history.pushState = (...args) => {
        apply();
        return _pushState.apply(history, args);
      };
    })(window.history);

    execdetect(true);
  };

  if( doc.body ) ready();
  else angular.element(document).ready(ready);
};

const stop = () => {
  observer.stop();
  window.removeEventListener('hashchange', _hashchangelistener);
  if( _pushState ) window.history.pushState = _pushState;
};

export {detect, apply, observer, start, stop};
