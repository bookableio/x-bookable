import {} from './util/classlist'; // polyfill for ie9
import connect from 'bookable';
import app, { emitter } from './app';
import { detect, start, stop } from './detector';
import {} from './less/index.less';

export {
  detect,
  start,
  stop,
  connect,
  app,
  emitter
};
