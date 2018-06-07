import xworkbench from 'x-workbench';
import URL from 'url';
import $ from 'jquery';
import {} from './style.less';
import {} from '../../../src/standalone';

const wb = new xworkbench('dashboard');

wb.find('logo').html('<a href="/"><b>X</b>BOOKABLE</a>');

wb
  .find('topnav-right')
  .items([
    {
      type: 'button',
      icon: '<i class="fa fa-github"></i>',
      onclick() {
        window.open('https://github.com/bookableio/x-bookable');
      }
    }
  ]);

wb
  .find('sidebar')
  .items([
    {
      type: 'navigation',
      group: 'sidenav',
      title: '숙박예약',
      cls: 'x-bookable',
      autocollapse: true,
      items: [
        {
          icon: '<i class="icon-file"></i>',
          text: '예제',
          items: [
            {
              icon: '<i class="icon-file"></i>',
              text: '달력기반 예약',
              link: '#accommodation/booking'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '객실별 예약',
              link: '#accommodation/bookaroom'
            }
          ]
        }, {
          icon: '<i class="icon-file"></i>',
          text: '달력',
          items: [
            {
              icon: '<i class="icon-file"></i>',
              text: '달력 - 객실선택',
              link: '#accommodation/calendar-roomtypes'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '달력 - 날짜선택',
              link: '#accommodation/calendar'
            }
          ]
        }, {
          icon: '<i class="icon-file"></i>',
          text: '예약/조회',
          items: [
            {
              icon: '<i class="icon-file"></i>',
              text: '파인더',
              link: '#accommodation/finder'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '장바구니',
              link: '#accommodation/cart'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '예약하기',
              link: '#accommodation/form'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '예약조회',
              link: '#accommodation/inquiry'
            }
          ]
        }, {
          icon: '<i class="icon-file"></i>',
          text: '객실 &amp; 정보',
          items: [
            {
              icon: '<i class="icon-file"></i>',
              text: '요금표',
              link: '#accommodation/rates'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '객실목록',
              link: '#accommodation/roomtypes'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '객실설명',
              link: '#accommodation/roomtype'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '사진슬라이드 - 객실사진',
              link: '#accommodation/photoslide-roomtype'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '썸네일 - 객실',
              link: '#accommodation/thumbnails-roomtype'
            }
          ]
        }
      ]
    }, {
      type: 'navigation',
      group: 'sidenav',
      title: '공통',
      cls: 'x-bookable',
      autocollapse: true,
      items: [
        {
          icon: '<i class="icon-file"></i>',
          text: '이용약관',
          link: '#common/terms'
        }, {
          icon: '<i class="icon-file"></i>',
          text: '슬라이드/썸네일',
          items: [
            {
              icon: '<i class="icon-file"></i>',
              text: '사진슬라이드',
              link: '#common/photoslide'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '썸네일',
              link: '#common/thumbnails'
            }
          ]
        }, {
          icon: '<i class="icon-file"></i>',
          text: '게시판',
          items: [
            {
              icon: '<i class="icon-file"></i>',
              text: '게시물 목록',
              link: '#common/article-list'
            }, {
              icon: '<i class="icon-file"></i>',
              text: '게시물 내용',
              link: '#common/article'
            }
          ]
        }
      ]
    }
  ]);


// navigation
function render(url) {
  $.ajax({
    url,
    success(html) {
      $('#page').html(html);
    }
  });
}

function handlehash() {
  const hash = location.hash.substring(1) || '';
  const pathname = URL.parse(hash).pathname || 'accommodation/booking';

  if( pathname ) {
    const view = wb.findview('[href="#' + pathname + '"]');
    const viewalt = wb.findview('[href^="#' + pathname + '"]');

    if( view || viewalt ) {
      (view || viewalt).select();
      render('/pages/' + pathname + '.html');
    }
  }
}

$(document).ready(() => {
  wb.render(document.body);

  window.addEventListener('hashchange', handlehash, false);
  handlehash();
});
