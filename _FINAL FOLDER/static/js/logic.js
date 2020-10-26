// DROPDOWN MENU
// toggle function
function myFunction() {
  document.getElementById("barDropdown").classList.toggle("show");
}

// close dropdown when clicking off
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// populate dropdown with bar names from flask API
d3.json("http://localhost:5000/api/v1.0/bar_names", function(barName) {
  var dropdownContent = document.querySelector('.dropdown-content');
  for (i = 0; i < barName.length; i++) {
    var element = barName[i];
    var htmlToAppend = document.createElement('a');
    htmlToAppend.innerHTML = element;
    dropdownContent.appendChild(htmlToAppend);
  };
});

// background layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">BreweryStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// layers
var layers = {
  Brewery: new L.LayerGroup(),
  Distillery: new L.LayerGroup(),
  wine_bar: new L.LayerGroup(),
  Selected: new L.LayerGroup(),  
  you_are_here: new L.LayerGroup()
};

// Denver map & layers
var map = L.map("map-id", {
  center: [39.7452, -104.9922],
  zoom: 14,
  layers: [
    layers.Brewery,
    layers.Distillery,
    layers.wine_bar,
    layers.Selected,
    layers.you_are_here
  ]
});

// add lightmap to Denver map
lightmap.addTo(map);

// overlays
var overlays = {
  "Brewery": layers.Brewery,
  "Distillery": layers.Distillery,
  "Wine Bar": layers.wine_bar,
  "Selected": layers.Selected,
  "You Are Here": layers.you_are_here
};
L.control.layers(null, overlays).addTo(map);

// icon objects for each category (Brewery, Distillery, Wine Bar)
var icons = {
  Brewery: L.ExtraMarkers.icon({
    markerColor: "red",
    shape: "circle"
  }),
  Distillery: L.ExtraMarkers.icon({
    markerColor: "white",
    shape: "circle"
  }),
  wine_bar: L.ExtraMarkers.icon({
    markerColor: "yellow",
    shape: "circle"
  }),
  Selected: L.ExtraMarkers.icon({
    markerColor: "green",
    shape: "star"
  }),
};
console.log(icons)

// API call here
// grab names
d3.json("http://localhost:5000/api/v1.0/bar_names", function(barName) {

  // grab bar data
  d3.json("http://localhost:5000/api/v1.0/bar_data", function(barData) {

    console.log(barName);
    console.log(barData);

    // loop to create bar code per category
    var BarCode;
    for (var i = 0; i < barName.length; i++) {

      // new bar object
      var bar = Object.assign({}, barName[i], barData[i]);

      // BarCode: Brewery
      if (bar.category == "Brewery") {
        BarCode = "Brewery";
      }
      // BarCode: Distillery
      else if (bar.category == "Distillery") {
        BarCode = "Distillery";
      }
      // BarCode: Wine Bar
      else if (bar.category == "Wine Bar") {
        BarCode = "wine_bar";
      }
      // BarCode: Selected
      // else if (bar.name == ) {
      //   BarCode = "Selected";
      // }
      // BarCode: Null
      else {
        BarCode = "null";
      };

      // markers with icon and coordinates
      var barMarker = L.marker([bar.latitude, bar.longitude], {
        icon: icons[BarCode]
      });
      
      // You Are Here marker
      var yourLatitude = 39.7452
      var yourLongitude = -104.9922
      var yourCoordinates = ([yourLatitude, yourLongitude])
      var pinpointMarker = L.marker(yourCoordinates, {
        title: "YOU ARE HERE",
        shadow: false,
        icon: L.ExtraMarkers.icon({
          markerColor: "blue",
          shape: "star",
        }),
      });

      // // selection marker
      // element.addEventListener("click", myFunction);

      // function myFunction() {
      //   alert ("Hello World!");
      // };

      // add markers to layers
      barMarker.addTo(layers[BarCode]);
      pinpointMarker.addTo(layers.you_are_here);

      // bind popups
      barMarker.bindPopup("<b>" + bar.name + "</b>"  + "<br> " + bar.address + "<br>" + bar.category + "<br>" + " Rating: " + bar.rating + "<br>" + bar.price + "<br>" + bar.phone);
      pinpointMarker.bindPopup("<b>YOU ARE HERE</b>")
    }
  });
});



