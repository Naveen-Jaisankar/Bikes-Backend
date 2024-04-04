// Initialize and add the map
var map;
var stationPositions = [];
let myLocation = {lat:'', lng:''};

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
        icon: {
            url: 'https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-Clipart.png', // URL to the custom icon
            scaledSize: new google.maps.Size(25, 25), // Sets the icon size
        }
      });
      myLocation.lat = position.lat;
      myLocation.lng = position.lng;
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
        icon: {
          url: 'https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-Clipart.png', // URL to the custom icon
          scaledSize: new google.maps.Size(25, 25), // Sets the icon size
      }
      });
    }
  });
}

function searchDestination(){
    console.log(myLocation);
    var address = document.getElementById("search-input").value;
    console.log(address);
}

async function getRoute(e){
                    e.preventDefault();

                    const url = new URL('http://127.0.0.1:5000/getRoutee');

                    const params = {
                        source:document.getElementById("source").value,
                        destination:document.getElementById("destination").value,
                        day:document.getElementById("day").value,
                        time:document.getElementById("time").value
                    }
                    // let route = new FormData(document.querySelector('form'));
                    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
                    console.log(route);

                    fetch(url, {
                      method: 'GET', // GET request
                  })
                  .then(response => response.json()) // parsing the JSON response
                  .then(
                    data => {
                      // document.getElementById('title').innerHTML = data
                      console.log(data[0])
                      var showResult = document.getElementById('showResult');
                      console.log(showResult);
                      showResult = '';
                      console.log(showResult);

                      // Create the card container
                      const card = document.createElement('div');
                      card.className = 'card';

                      // Create the card header
                      const cardHeader = document.createElement('div');
                      cardHeader.className = 'card-header';
                      cardHeader.textContent = data[0].name;

                      // Create the card header span
                      const cardHeaderSpan = document.createElement('span');
                      cardHeaderSpan.textContent = data[0].address;

                      // Append the card header span to the card header
                      cardHeader.appendChild(cardHeaderSpan);

                      // Append the card header to the card
                      card.appendChild(cardHeader);

                      // Create the card content container
                      const cardContent = document.createElement('div');
                      cardContent.className = 'card-content';

                      // Create the first content div
                      const contentDiv1 = document.createElement('div');
                      const contentP1 = document.createElement('p');
                      contentP1.textContent = data[0].available_bike_stands;
                      const contentSpan1 = document.createElement('span');
                      contentSpan1.textContent = 'Available Stands';

                      // Append p and span to the first content div
                      contentDiv1.appendChild(contentP1);
                      contentDiv1.appendChild(contentSpan1);

                      // Append the first content div to the card content
                      cardContent.appendChild(contentDiv1);

                      // Create the second content div
                      const contentDiv2 = document.createElement('div');
                      const contentP2 = document.createElement('p');
                      contentP2.textContent =data[0].available_bikes;
                      const contentSpan2 = document.createElement('span');
                      contentSpan2.textContent = 'Available Bikes';

                      // Append p and span to the second content div
                      contentDiv2.appendChild(contentP2);
                      contentDiv2.appendChild(contentSpan2);

                      // Append the second content div to the card content
                      cardContent.appendChild(contentDiv2);

                      // Append the card content to the card
                      card.appendChild(cardContent);
                      
                      console.log(card);
                      // Finally, append the card to the body or any other container element
                      document.getElementById('showResult').appendChild(card);
                    }
                    
                    ) // handling the data from the response
                  .catch(error => console.error('Error:', error)); // handling any error
}

function searchRoute(){
    // method="post" action="/getRoute"
    var html = `
<div class="container">
        <form >
            <label for="source">Source</label>
            <input type="text" name="source"  id="source" placeholder="Enter your sources here" required><br>
            <label for="destination">Destination</label>
            <input type="text"  name="destination" placeholder="Enter your destination here" id="destination" required><br>
            <label for="day">Day</label>
            <select id="day" required>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
            </select>
            <label for="time">Time</label>
            <input type="text" placeholder="hh:mm" id="time" required><br>
            <button type="submit" onClick="getRoute(event);">Plan Your Journey</button>
        </form>
</div>
    `;
    document.getElementById('showInfo').innerHTML = html;
}