import bookable from 'bookable';
import GoogleMapsLoader from 'google-maps';

export default ['safeApply', 'staged', 'event', '$timeout', 'evalattr', function(safeApply, staged, event, $timeout, evalattr) {
  return {
    template: require('./googlemaps.html'),
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
        if( !staged(element) ) return;

        bookable.info({
          serviceid: evalattr(attrs.serviceid),
          host: location.hostname
        }).exec((err, business) => {
          if( err ) return error(err);
          if( !business ) return error(new Error('존재하지 않는 서비스'));

          const info = business.info || {};
          GoogleMapsLoader.KEY = evalattr(attrs.apikey) || info.googlemapskey;
          GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

          GoogleMapsLoader.load((google) => {
            const latlng = business.latlng;
            const center = latlng ? new google.maps.LatLng(latlng[1], latlng[0]) : new google.maps.LatLng(33.450701, 126.570667);

            const map = new google.maps.Map(element[0].querySelector('.x-bookable-google-map'), {
              zoom: 16,
              center,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              navigationControl: true,
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: false,
              scrollwheel: false,
              draggable: true
            });

            const marker = new google.maps.Marker({
              position: center,
              map,
              title: business.name
            });

            const infowindow = new google.maps.InfoWindow({
              content: business.name,
              maxWidth: 300
            });

            infowindow.open(map, marker);

            google.maps.event.addListener(marker, 'click', () => {
              infowindow.open(map, marker);
            });
          });
        });
      };

      scope.refresh = refresh;

      attrs.$observe('ratio', () => {
        scope.ratio = evalattr(attrs.ratio);
        safeApply(scope);
      });

      $timeout(refresh, 0);
    }
  };
}];
