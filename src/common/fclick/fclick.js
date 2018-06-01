export default () => {
  const abs = Math.abs;

  return {
    restrict: 'A',
    priority: 100,
    link(scope, element, attr) {
      let cancelclick = false, firstx, firsty, lastx, lasty, sumx, sumy;

      element.on('mousedown', (e) => {
        cancelclick = false;
        firstx = e.clientX;
        firsty = e.clientY;
        sumx = sumy = 0;
      })
        .on('mousemove', (e) => {
          sumx += abs(lastx - e.clientX);
          sumy += abs(lasty - e.clientY);
          lastx = e.clientX;
          lasty = e.clientY;

          if( abs(firstx - lastx) > 50 || abs(firsty - lasty) > 50 || sumx > 50 || sumy > 50 ) {
            cancelclick = true;
          }
        })
        .on('click', () => {
          if( cancelclick ) return;
          scope.$eval(attr.ngFclick, {$event:event});
        });
    }
  };
};
