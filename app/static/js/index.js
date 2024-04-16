// Initialize and add the map
var map;
var stationPositions = [];
var stationData;
let myLocation = {lat:'', lng:''};
let data;
var directionsService ;
var directionsDisplay;
var markersArary = [];
var findRouteResponse;
async function initMap() {
  var position;
  directionsService= new google.maps.DirectionsService();
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //       // position = {lat: position.coords.latitude, lng: position.coords.longitude};
  //       position = {lat:53.3498, lng:-6.2603};
  //       map = new google.maps.Map(document.getElementById("map"), {
  //         zoom: 15,
  //         center: position,
  //         mapTypeControl: false,
  //         fullscreenControl:false,
  //         streetViewControl: false,
  //         zoomControl:false,
  //         keyboardShortcuts:false,
  //         styles: [
  //             { elementType: 'geometry', stylers: [{color: '#f5f5f5'}] },
  //             { elementType: 'labels.icon', stylers: [{visibility: 'off'}] },
  //             { elementType: 'labels.text.fill', stylers: [{color: '#1b1b1b'}] },
  //             { elementType: 'labels.text.stroke', stylers: [{color: '#f5f5f5'}] },
  //             {
  //                 featureType: 'water',
  //                 elementType: 'geometry',
  //                 stylers: [{color: '#c9c9c9'}]
  //             },
  //             {
  //                 featureType: 'landscape',
  //                 elementType: 'geometry',
  //                 stylers: [{color: '#e3e3e3'}]
  //             }
  //       ]
  //     });
  //       directionsDisplay = new google.maps.DirectionsRenderer({
  //               draggable: true,
  //               map,
  //               panel: document.getElementById("overlayContent")
  //           });
  //           directionsDisplay.setMap(map);
  //     const marker = new google.maps.Marker({
  //       map: map,
  //       position: position,
  //       title: "Your Location",
  //       icon: {
  //           url: 'https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-Clipart.png', // URL to the custom icon
  //           scaledSize: new google.maps.Size(25, 25), // Sets the icon size
  //       }
  //     });
  //     myLocation.lat = position.lat;
  //     myLocation.lng = position.lng;
  //     getStationCoordinates()
  //   }, function() {
  //       alert('Error: The Geolocation service failed.');
  //   });
  // } else {
  //     alert('Error: Your browser doesn\'t support geolocation.');
  // }
    position = {lat:53.3498, lng:-6.2603};
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
        directionsDisplay = new google.maps.DirectionsRenderer({
                draggable: true,
                map,
                panel: document.getElementById("overlayContent")
            });
            directionsDisplay.setMap(map);
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
}

function getStationCoordinates(){

  fetch('/getData')
  .then(response => response.json())
      .then(stations => {
        stationData = stations;
          data = stations;
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
    var availability_percentage = parseInt(obj.available_bikes) / (parseInt(obj.available_bikes) + parseInt(obj.available_bike_stands));
                if (availability_percentage > .7) {
                    color = "green";
                } else if (availability_percentage > .3) {
                    color = "orange";
                } else {
                    color = "red";
                }
                let url = "http://maps.google.com/mapfiles/ms/icons/";
                url += color + "-dot.png";

                let contentString = `
                <div>
                    <p><b>Name</b>: ${obj.name}</p>
                    <p><b>Total Bike Stands</b>: ${obj.bike_stands}</p>
                    <p><b>Total Available Bike Stands</b>: ${obj.available_bike_stands}</p>
                    <p><b>Available Bikes</b>: ${obj.available_bikes}</p>
                </div>
            `;
    // var url = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+obj.available_bikes+'|FF776B|000000';
    // let contentString = `
    //             <div>
    //                 <p><b>Name</b>: ${obj.name}</p>
    //                 <p><b>Total Bike Stands</b>: ${obj.bike_stands}</p>
    //                 <p><b>Total Available Bike Stands</b>: ${obj.available_bike_stands}</p>
    //                 <p><b>Available Bikes</b>: ${obj.available_bikes}</p>
    //             </div>
    // `;

    var infowindow =  new google.maps.InfoWindow({
	    content: contentString,
	    map: map,
        title: obj.name
    });
  const marker = new google.maps.Marker({
    map: map,
    position: position,
    title: obj.available_bikes,
      icon:{
        url
      },
      shadow:'https://chart.googleapis.com/chart?chst=d_map_pin_shadow'
  });
  markersArary.push(marker);
  marker.addListener('mouseover', function() {
        infowindow.open(map, this);
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

// function stationToStation() {
//     var selectedOptionVal1 = $('#station_dd_1').find(":selected").val();
//     var selectedOptionVal2 = $('#station_dd_2').find(":selected").val();
//     calcRoute({
//         "lat": stations[selectedOptionVal1][0],
//         "lng": stations[selectedOptionVal1][1]
//     }, [stations[selectedOptionVal2][0], stations[selectedOptionVal2][1]], "bike");
//     // $('#overlay').css({'opacity': 100});
//     return false;
// }

async function getRoute(e){
                    e.preventDefault();
                    // prompt box
                    document.getElementById('loadingMessage').style.display = 'block';

                    // const url = new URL('http://127.0.0.1:5000/getRoutee');
                    const url = new URL('http://3.249.156.68/getRoutee');
                    let destinationId;
                    var latLngMap = new Map();
                    destination=document.getElementById("destination").value;
                    source = document.getElementById("source").value;
                    for(let i of data){
                        if(i.name.toUpperCase()==destination.toUpperCase()){
                            destinationId = i.number;
                            latLngMap.set(destination, i.position);
                        }
                        if(i.name.toUpperCase()==source.toUpperCase()){
                            latLngMap.set(source, i.position);
                        }
                    }

                    const params = {
                        source:document.getElementById("source").value,
                        destination:document.getElementById("destination").value,
                        id:destinationId,
                        // day:document.getElementById("day").value,
                        // time:document.getElementById("time").value
                    }
                    // let route = new FormData(document.querySelector('form'));
                    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
                    // console.log(route);

                    fetch(url, {
                      method: 'GET', // GET request
                  })
                  .then(response => response.json()) // parsing the JSON response
                  .then(
                    data => {
                        // var selectedOptionVal1 = $('#station_dd_1').find(":selected").val();
                        // var selectedOptionVal2 = $('#station_dd_2').find(":selected").val();
                        var selectedOptionVal1 = document.getElementById("source").value;
                        var selectedOptionVal2 = document.getElementById("destination").value;
                        findRouteResponse = data;
                        calcRoute(
                         latLngMap.get(source), latLngMap.get(destination), "bike");
                      // document.getElementById('title').innerHTML = data
                      // console.log(data[0])
                        console.log(findRouteResponse.availableStations);
                        showBikeAvaibilityChart();
                        availableStation = 0;
                        if(parseFloat(findRouteResponse.availableStations)<1){
                            availableStation = -1*parseFloat(findRouteResponse.availableStations);
                        }
                        else{
                            availableStation = parseFloat(findRouteResponse.availableStations);
                        }
                        console.log(availableStation)
                        let html = `
                            <div class="card">
                                <span>Predicted Number of Avaibility Bikes for Destination Station ${destination} : <b>${availableStation}</b></span>
                            </div>
            `;
                      document.getElementById('showResult').innerHTML = html;
                    }
                    
                    ) // handling the data from the response
                  .catch(error => console.error('Error:', error)); // handling any error
}

function showBikeAvaibilityChart(){
temp = findRouteResponse.time;
console.log(temp);
var xValues = ["last 40 min", "last 35 min", "last 30 min", "last 25 min", "last 20 min", "last 15 min", "last 10 min", "last 05 min"];
var yValues = temp;
var barColors = [];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Bike Avaibility Data"
    }
  }
});
}

function calcRoute(start, end, type) {
    start = new google.maps.LatLng(start.lat, start.lng);
    end = new google.maps.LatLng(end.lat, end.lng);
    after_directions_latlng = end;
    travel_mode = google.maps.DirectionsTravelMode.BICYCLING;
    var request = {
        origin: start,
        destination: end,
        travelMode: travel_mode
    };

    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            if ($('#overlay').length) {
                // pass;
            } else {
                $('#card').append("" +
                    "            <div class='card' id=\"overlay\">\n" + "<button onclick='PrintElem()'>Print Directions</button>" +
                    "                <span id='close'\n" +
                    "                      onClick='this.parentNode.parentNode.removeChild(this.parentNode);  return false;'>x</span>\n" +
                    "                <div id=\"overlayContent\"></div>\n" +
                    "            </div>\n"
                );
                $('#close').on('click', function () {
                    directionsDisplay.setMap(null);
                    directionsDisplay.setPanel(null);
                    map.setZoom(15);
                    map.setCenter(after_directions_latlng);
                });


                directionsDisplay.setPanel(document.getElementById("overlayContent"));

            }

            // Define route bounds for use in offsetMap function
            routeBounds = response.routes[0].bounds;

            // Write directions steps

            // Wait for map to be idle before calling offsetMap function
            google.maps.event.addListener(map, 'idle', function () {

                // Offset map
                offsetMap();
            });

            // Listen for directions changes to update bounds and reapply offset
            google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {

                // Get the updated route directions response
                var updatedResponse = directionsDisplay.getDirections();

                // Update route bounds
                routeBounds = updatedResponse.routes[0].bounds;
                // console.log(routeBounds);
                // Fit updated bounds
                map.fitBounds(routeBounds);

                // Write directions steps

                // Offset map
                offsetMap();
            });
        }
    });
}

function searchRoute(){
    let html = `
<div class="container">
        <form >
            <label for="source">Source</label>
            <input type="text" name="source"  id="source" placeholder="Enter your sources here" required><br>
            <label for="destination">Destination</label>
            <input type="text"  name="destination" placeholder="Enter your destination here" id="destination" required><br>
            <button type="submit" onClick="getRoute(event);">Plan Your Journey</button>
            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        </form>
</div>
    `;
    document.getElementById('showInfo').innerHTML = html;
}

var city_name = 'Dublin';
var country_code = 'IE';
var appid = '71287dae2da257653b6b14989d35491f';
// Show current weather
document.addEventListener('DOMContentLoaded', function() {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name},${country_code}&appid=${appid}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Show the current icon
            var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            var weatherIcon = document.getElementById('weatherIcon');
            weatherIcon.src = iconUrl;

            // Show the current temperature
            var tempCelsius = (data.main.temp - 273.15).toFixed(0);
            document.getElementById('temperature').textContent = tempCelsius + ' °C';

            // Show the current main weather
            document.getElementById('weatherMain').textContent = data.weather[0].main;
        })
        .catch(error => console.error('Fetching weather data failed', error));
});

// Show 5-day weather forecast
document.addEventListener('DOMContentLoaded', function() {
    var url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city_name},${country_code}&cnt=5&appid=${appid}`;
    var forecastContainer = document.getElementById('weather-forecast');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.list.forEach(function(day) {
                // Get the date and show it in 'Apr 1' style
                var date = new Date(day.dt * 1000);
                var dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                // Show main, icon and temperature in 5 days
                var main = day.weather[0].main;
                var iconCode = day.weather[0].icon;
                var tempCelsius = (day.temp.day - 273.15).toFixed(0);

                var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

                var dayForecastDiv = document.createElement('div');
                dayForecastDiv.className = 'day-forecast';
                dayForecastDiv.innerHTML = `
                    <p class="fore-date">${dateString}</p>
                    <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
                    <p class="fore-main">${main}</p>
                    <p class="fore-tmp">${tempCelsius} °C</p>
                `;

                forecastContainer.appendChild(dayForecastDiv);
            });
        })
        .catch(error => console.error('Fetching weather data failed', error));
});


function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('locationSearch'),
        { types: ['geocode'] }
    );
    autocomplete.bindTo('bounds', map);


    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component','geometry']);

    // Set up a listener to do something when a user selects a location from the
    // suggestions. For example, you can retrieve the user's selected address
    // components here if needed.
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log(place)
        if (!place.geometry) {
            stationData.forEach(function(station) {
                addMarkerWithLabel({lat: station.position.lat, lng: station.position.lng}, station);
            });
            return;
        }
        console.log(place);
        // Now that we have a place, let's find the nearest stations
        const userLocation = place.geometry.location;
        const nearestStations = findNearestStations(userLocation);

        clearMarkers();

        nearestStations.forEach(function(station) {
            addMarkerWithLabel({lat: station.position.lat, lng: station.position.lng}, station);
        });

        adjustCameraToMarkers()
        
        // Implement what you want to do with the selected place info here.
        // For instance, you can extract the address components.
    });
}

// const locationSearchInput = document.getElementById('locationSearch');
//     locationSearchInput.addEventListener('input', function() {
//         if (!this.value) {
//             // Input field has been cleared
//             stationData.forEach(function(station) {
//                 addMarkerWithLabel({lat: station.position.lat, lng: station.position.lng}, station);
//             });
//         }
//     });
function clearMarkers() {
    for (let i = 0; i < markersArary.length; i++) {
        markersArary[i].setMap(null);
    }
    markersArary = []; // Clear the array
}

function adjustCameraToMarkers() {
    if (markersArary.length === 0) return; // Check if there are markers

    const bounds = new google.maps.LatLngBounds();
    markersArary.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    // Smoothly pan the map
    const center = bounds.getCenter();

    // Smoothly pan to the center of the bounds
    map.panTo(center);

    // // Optionally, set a timeout to adjust zoom after panning. This isn't smooth but prevents zooming before panning.
    // setTimeout(() => {
    //     map.fitBounds(bounds, {padding: 10}); // Adjust the map view
    // }, 3000); // Adjust the timeout as needed
}

function findNearestStations(userLocation) {
    const radius = 1000; // 5 km in meters
    const nearestStations = stationData.filter(station => {
        const stationLocation = new google.maps.LatLng(station.position.lat, station.position.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, stationLocation);
        return distance <= radius;
    })
    .sort((a, b) => {
        const locationA = new google.maps.LatLng(a.latitude, a.longitude);
        const locationB = new google.maps.LatLng(b.latitude, b.longitude);
        const distanceA = google.maps.geometry.spherical.computeDistanceBetween(userLocation, locationA);
        const distanceB = google.maps.geometry.spherical.computeDistanceBetween(userLocation, locationB);
        return distanceA - distanceB;
    })
    .slice(0, 5);



    // Here you can do something with the nearest stations, like displaying them on the map
    console.log(nearestStations);

    return nearestStations;
}

// When the window has finished loading, initialize the autocomplete function.
window.addEventListener('load', initAutocomplete);

// Allow the user to close the prompt box
function closeLoadingMessage() {
    document.getElementById('loadingMessage').style.display = 'none';
}

$(document).ready(function() {
    var $select = $('.select2').select2({
        placeholder: "Select a station",
        allowClear: true
    });
    console.log('unde')
    // Populate the select element with options from stationData
    if (typeof stationData === 'undefined') {
        fetch('/getData')
  .then(response => response.json())
      .then(stations => {
        stationData = stations;
        stationData.forEach(function(station) {
            var option = new Option(station.address, station.number, false, false);
            $select.append(option).trigger('change');
        });
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
    }else{
        console.log('unde')
        stationData.forEach(function(station) {
            var option = new Option(station.address, station.number, false, false);
            $select.append(option).trigger('change');
        });
    }
    

    // Update Select2
    $select.trigger('change');
});
