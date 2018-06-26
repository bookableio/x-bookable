const listenersmap = {};

export default class EventEmitter {
  on(type, fn) {
    const listeners = listenersmap[type] = listenersmap[type] || [];
    listeners.push(fn);
    return this;
  }

  off(type, fn) {
    const listeners = listenersmap[type] = listenersmap[type] || [];
    const pos = listeners.indexOf(fn);
    if( ~pos ) listeners.splice(pos, 1);
    return this;
  }

  fire(type, detail = {}) {
    const listeners = listenersmap[type];
    listeners && listeners.forEach(listener => {
      listener({
        type,
        detail
      });
    });
    return this;
  }
}
