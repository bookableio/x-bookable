import angular from 'angular';
import inlineevent from './inlineevent';

export default function() {
  return {
    regist(element, attrs, type) {
      const el = (element[0] || element);
      let inline;
      let fn;

      if(('on' + type) in el) return;

      const watcher = () => {
        inline = attrs['on' + type];
        fn && el.removeEventListener(type, fn);
        fn = inlineevent(inline);
        fn && el.addEventListener(type, fn);
      };

      attrs.$observe('on' + type, watcher);
      watcher();
    },
    fire(element, type, detail = {}, bubbles = false, cancelable = false) {
      const el = (element[0] || element);
      const script = el.getAttribute('ng-' + type);
      const scope = angular.element(element).isolateScope();
      let event;

      if( script && scope && scope.$parent ) {
        const ngdetail = {};
        Object.keys(detail).forEach(key => ngdetail['$' + key] = detail[key]);
        scope.$parent.$eval(script, ngdetail);
      }

      try {
        event = new CustomEvent(type, {
          detail,
          bubbles,
          cancelable
        });
      } catch(e) {
        event = document.createEvent('Event');
        event.initEvent(type, bubbles, cancelable );
        event.detail = detail;
      }

      return el.dispatchEvent(event);
    }
  };
}
