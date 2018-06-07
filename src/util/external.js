export default (business) => {
  // 만약 외부시스템을 사용하고 팝업이라면 라우팅을 중지하고 팝업창을 띄운다.
  const external = business.info && business.info.external;
  if( external && external.use && external.popup && external.inquiry ) {
    const url = external.inquiry;
    const width = +external.width || 800;
    const height = +external.height || 600;
    let left = Math.abs((window.screen.width - width) / 2);
    let top = Math.abs((window.screen.height - height) / 2);
    if( left <= 0 ) left = 0;
    if( top <= 0 ) top = 0;

    window.open(url, 'booking', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left + ', scrollbars=no,resizable=no');
  }
};
