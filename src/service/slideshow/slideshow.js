import $ from 'jquery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeDefaultUI from 'photoswipe/dist/photoswipe-ui-default.js';
import {} from 'photoswipe/dist/photoswipe.css';
import {} from 'photoswipe/dist/default-skin/default-skin.css';
import slidetplhtml from './slidetpl.html';
import cdn from '../../util/cdn';

const slidetpl = $(slidetplhtml);

export default function () {
  return (arr, index) => {
    if( !arr ) return;

    index = index || 0;

    const items = [];
    arr.forEach((item) => {
      items.push({
        src: cdn(item.url),
        w: item.width,
        h: item.height
      });
    });

    new PhotoSwipe(slidetpl.appendTo(document.body)[0], PhotoSwipeDefaultUI, items, {
      index,
      history: false,
      bgOpacity: 0.95
    }).init();
  };
}
