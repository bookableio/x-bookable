# x-bookable

> 예약관리 서비스 [`북커블`](https://bookable.io) 의 기능들을 웹사이트를 개발할 때 태그 기반으로 손쉽게 연동할 수 있도록 제작된 태그 라이브러리입니다. 아이프레임/팝업창 방식의 연동과 달리 직접 html 내에서 실행되어 스타일시트를 재정의하거나 좀 더 디자인 친화적으로 웹사이트내에 예약관련 기능을 연동할 수 있습니다. IE9+ 과 대부분의 모던브라우저를 지원합니다.


## 예제 웹사이트
[예제 웹사이트 보기](https://github.com/bookableio/x-bookable-example)

## 설치
### 태그 사용 개발시
의존성으로 `jquery` 와 `angular@1.6` 이 필요합니다. (`jquery@1.2 이상` `angular@1.6 이상` 필요)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.5/angular.min.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
```

head 혹은 body 최하단에 css 와 js 를 추가하세요.

```html
<link rel="stylesheet" href="https://unpkg.com/x-bookable@0.4/dist/xbookable.css">
<script src="https://unpkg.com/x-bookable@0.4/dist/xbookable.js"></script>
```

- [태그로 개발하기](#태그로-개발하기)

### npm 을 통한 설치
```sh
$ npm i x-bookable --save
```

- [npm 기반으로 개발하기](#npm-기반으로-개발하기)
- [angular app 으로 개발하기](#angular-app-으로-개발하기)

## 사용방법

### 태그로 개발하기
js/css 선언 후 원하는 곳에 `x-bookable` 이 지원하는 태그를 이용해 예약 및 관련 기능을 추가할 수 있습니다.

#### 태그 사용 예제
```html
<bookable-accommodation-calendar-roomtype showrates onselect="console.log(event.detail)"></bookable-accommodation-calendar-roomtype>
```

### npm 기반으로 개발하기
```javascript
var xbookable = require('x-bookable');
xbookable.start(); // start 시 mutation observer 를 통해 태그를 자동으로 탐색하고 실행합니다.)
xbookable.stop(); // 태그 탐색 중지
```

```javascript
// mutation observer 사용하지 않고 태그 실행하기
xbookable.detect();
```

### angular app 으로 개발하기
> 태그를 angular 의 디렉티브로 사용할 수 있습니다. (아래 태그 사용 방법에서 이벤트의 경우 onselect -> ng-select, 이벤트로 전달되는 값은 reservation -> $reservation 컨벤션 형식으로 대치)

```javascript
require('x-bookable');
angular.module('app', ['bookable'])...
```

## 지원하는 태그
> 대부분의 속성은 분리된 페이지에서 변수를 주고 받으며 개발할 수 있도록 쿼리스트링 혹은 hash, 경로명, 글로벌 변수등 파라미터로 받은 값을 사용할 수 있습니다. [파라미터스트링 사용방법](#파라미터스트링)

### 달력기반 예약
```html
<bookable-accommodation-booking showrates onselect="console.log('달력 선택됨:' + event.detail.date, event.detail.rates, (event.detail.roomtype && event.detail.roomtype.name));" label-closed="예약불가"></bookable-accommodation-booking>
```

- 속성 (attribute)
	- showrates : 요금표시 여부
	- label-closed : 예약불가능 일자 표시 문구 (기본값: 예약마감)
- 이벤트 (event) 
	- onselect : 특정일의 객실 선택시
		- date : 선택일 (20180101 형식)
      	- roomtype : 선택한 객실정보 (object)
      	- rates : 해당일의 요금정보 (object)


### 객실별 예약
```html
<bookable-accommodation-bookaroom roomtypeid="$param:roomtypeid" cart-href="/cart"></bookable-accommodation-bookaroom>
```

- 속성 (attribute)
	- roomtypeid : 객실ID
	- show-detail : 요금 자세히 표시여부
	- use-cart : 장바구니 버튼 표시여부

- 이벤트 (event) 
	- oncomplete : 예약완료시
      	- reservation : 예약정보 (object)
	- oncart : 장바구니 추가시
      	- rooms : 예약할 객실정보 (object)

### 예약조회
```html
<bookable-accommodation-inquiry mobile="010-0000-0000" cn="81631"></bookable-accommodation-inquiry>
```

- 속성 (attribute)
	- mobile : 예약자 휴대전화번호 (예약시 입력한 휴대전화번호, 대시 `-` 등 제외 조회 가능)
	- cn : 예약시 발급된 예약번호 (5자리 숫자)

### 객실목록
```html
<bookable-accommodation-roomtypes listingtype="rates" button-label="예약하기" onselect="location.href='#accommodation/roomtype?roomtypeid=' + event.detail.roomtype.id"></bookable-accommodation-roomtypes>
```

- 속성 (attribute)
	- listingtype : 표시형태 (media, rates, thumbnail, picture, crossbox)
	- button-label : 버튼 텍스트
	- col : 기본 컬럼수
	- colxs : xs 사이즈 스크린에서의 컬럼수
	- colsm : sm 사이즈 스크린에서의 컬럼수
	- colmd : md 사이즈 스크린에서의 컬럼수
	- collg : lg 사이즈 스크린에서의 컬럼수

- 이벤트 (event) 
	- onselect : 객실 선택시
      	- roomtype : 선택한 객실정보 (object)


### 객실정보
```html
<bookable-accommodation-roomtype roomtypeid="$param:roomtypeid"></bookable-accommodation-roomtype>
```

- 속성 (attribute)
	- roomtypeid : 객실ID


### 사진 슬라이드
```html
<bookable-photo-slide slidesetid="photo"></bookable-photo-slide>
```

- 속성 (attribute)
	- slidesetid : 표시할 슬라이드 ID
		- photo : 대표사진
		- facilities : 시설사진
		- roomtypes : 객실사진
	- slideid : 객실사진의 경우 객실 ID
	- open-slideshow : 사진 클릭시 전체화면 슬라이드쇼 시작여부 (true/false, 기본값 : true)
	- ratio : 사진표시비율 (16by9, 1by1, 4by3, 3by2)
	- zoomin : 줌인효과 사용여부
	- fade : 슬라이드 넘길 때 fade 효과 사용여부
	- speed : 사진 전환 속도 (숫자, ms 단위)
	- autoplayspeed : 자동넘김 속도 (숫자, ms 단위)

#### 객실 사진 슬라이드 예제
```html
<bookable-photo-slide slidesetid="roomtypes" slideid="$param:roomtypeid" size="16by9"></bookable-photo-slide>
```

### 썸네일
```html
<bookable-thumbnails slidesetid="photo"></bookable-thumbnails>
```

- 속성 (attribute)
	- slidesetid : 표시할 슬라이드 ID
		- photo : 대표사진
		- facilities : 시설사진
		- roomtypes : 객실사진
	- slideid : 객실사진의 경우 객실 ID
	- open-slideshow : 사진 클릭시 전체화면 슬라이드쇼 시작여부 (true/false, 기본값 : true)
	- ratio : 사진표시비율 (16by9, 1by1, 4by3, 3by2)	- col : 기본 컬럼수
	- colxs : xs 사이즈 스크린에서의 컬럼수
	- colsm : sm 사이즈 스크린에서의 컬럼수
	- colmd : md 사이즈 스크린에서의 컬럼수
	- collg : lg 사이즈 스크린에서의 컬럼수

### 약관/이용안내
```html
<bookable-terms termsid="terms"></bookable-terms>
```

- 속성 (attribute)
	- termsid : 표시할 terms id
		- terms : 이용약관
		- refund : 환불안내
		- notice : 이용시 유의사항
		- payment : 결제방법 안내


## 파라미터스트링
> 대부분의 속성에 쿼리스트링/해시등으로 넘겨받은 변수를 사용하기 위해 파라미터스트링을 사용할 수 있습니다. 분리되어 작성된 페이지에서 서로 적절하게 파라미터를 주고받아 원하는 객실/게시물 등을 표시할 수 있도록 해줍니다.

### 쿼리스트링
쿼리스트링(예:`/room.html?rid=Syg6DgH-17`) 형태로 받은 쿼리스트링 파라미터를 속성에 입력할 때 사용할 수 있습니다.

```
<bookable-accommodation-bookaroom roomtypeid="$param:rid" ...>
```

### URL 경로
URL 의 파일명(예:`/rooms/Syg6DgH-17`) 형태의 경로명을 파라미터를 속성에 입력할 때 사용할 수 있습니다.

```
<bookable-accommodation-bookaroom roomtypeid="$basename" ...>
```

/rooms/Syg6DgH-17/detail 처럼 상위단계의 경로명을 사용하려면, (최하단의 경로명은 0 입니다/기본값, 상위경로명으로 갈수록 1씩 증가)

```
<bookable-accommodation-bookaroom roomtypeid="$basename:1" ...>
```

### 해시명
`/room.html#Syg6DgH-17` 형식일 때,

```
<bookable-accommodation-bookaroom roomtypeid="$hash" ...>
```

### 글로벌 변수
`var rid='Syg6DgH-17'` 처럼 미리 글로벌 변수로 선언되어 있는 경우,

```
<bookable-accommodation-bookaroom roomtypeid="$var:rid" ...>
```

## 라이센스
[MPL-2.0 (Mozilla Public License, version 2.0)](./LICENSE)