// Initialize and add the map
var map;
var stationPositions = [];

async function initMap() {
  var position;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        position = {lat: position.coords.latitude, lng: position.coords.longitude}
        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: position,
          mapTypeControl: false,
          fullscreenControl:false,
          streetViewControl: false,
          zoomControl:false,
          keyboardShortcuts:false,
          styles: [
              { elementType: 'geometry', stylers: [{color: '#f5f5f5'}] },
              { elementType: 'labels.icon', stylers: [{visibility: 'off'}] },
              { elementType: 'labels.text.fill', stylers: [{color: '#1b1b1b'}] },
              { elementType: 'labels.text.stroke', stylers: [{color: '#f5f5f5'}] },
              {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{color: '#c9c9c9'}]
              },
              {
                  featureType: 'landscape',
                  elementType: 'geometry',
                  stylers: [{color: '#e3e3e3'}]
              }
        ]
      });
      const marker = new google.maps.Marker({
          map: map,
          position: position,
          title: "Your Location",
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Set custom icon
      });
      getStationCoordinates()
    }, function() {
        alert('Error: The Geolocation service failed.');
    });
  } else {
      alert('Error: Your browser doesn\'t support geolocation.');
  }
}

function getStationCoordinates(){

  fetch('/getData')
  .then(response => response.json())
      .then(stations => {
        stations.forEach(function(station) {
            addMarkerWithLabel({lat: station.position.lat, lng: station.position.lng}, station);
        });
        stationPositions = stations;
        console.log(stationPositions);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}

function bindInfoWindow(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
}
function addMarkerWithLabel(position, obj) {
    var infowindow =  new google.maps.InfoWindow({
	content: '',
	map: map
});
  const marker = new google.maps.Marker({
    map: map,
    position: position,
    title: obj.name
  });
  marker.addListener('mouseover', function() {
    infowindow.open(map, this);
    // infowindow.setContent(obj.name);
      bindInfoWindow(marker, map, infowindow, `
        <div>
            <p>
                <b>Name</b>: ${obj.name}
            </p>
            <p>
                <b>Total Bike Stands</b>: ${obj.bike_stands}
            </p>
            <p>
                <b>Total Available Bike Stands</b> : ${obj.available_bike_stands}
            </p>
            <p>
               <b>Available Bikes</b>: ${obj.available_bikes}
            </p>
        </div>
      `);
});

// assuming you also want to hide the infowindow when user mouses-out
marker.addListener('mouseout', function() {
    infowindow.close();
});
}

function search(){
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById("search-input").value;

  var mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
            { visibility: "off" }
        ]
    }
  ];

  geocoder.geocode({
    'address': address
  }, async function (results, status) {
    var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();
    const position = { lat: latitude, lng: longitude };
    if (status == google.maps.GeocoderStatus.OK) {
      let Map;
      ({Map} = await google.maps.importLibrary("maps"));
      const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

      // The map, centered at Uluru
      map = new Map(document.getElementById("map"), {
        zoom: 14,
        center: position,
        mapId: "DEMO_MAP_ID",
        styles : mapStyles
      });

      // The marker, positioned at Uluru
      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: address,
      });
    }
  });
}