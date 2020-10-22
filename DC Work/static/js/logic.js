// background layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">BreweryStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: "pk.eyJ1IjoiZHNjNTU3MDQ5NzMiLCJhIjoiY2tmdTFleWdiMGV0dTJ5cTY2ejU2dzlyYyJ9.ElNLHLSolt8LTsybJHu0jQ"
});

// layers
var layers = {
  Brewery: new L.LayerGroup(),
  Distillery: new L.LayerGroup(),
  wine_bar: new L.LayerGroup(),
};

// Denver map & layers
var map = L.map("map-id", {
  center: [39.7452, -104.9922],
  zoom: 14,
  layers: [
    layers.Brewery,
    layers.Distillery,
    layers.wine_bar,
  ]
});

// add lightmap to Denver map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Brewery": layers.Brewery,
  "Distillery": layers.Distillery,
  "Wine Bar": layers.wine_bar,
};
L.control.layers(null, overlays).addTo(map);

// legend
var info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

info.addTo(map);

// icon objects for each category (Brewery, Distillery, Wine Bar)
var icons = {
  Brewery: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  Distillery: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "black",
    markerColor: "white",
    shape: "circle"
  }),
  wine_bar: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "red",
    markerColor: "yellow",
    shape: "circle"
  }),
};

// API call here (need help connecting to flask app and connecting flask app to SQL)
// grab names
d3.json("http://localhost:5000/api/v1.0/bar_names", function(barName) {

  // second call to grab bar data
  d3.json("http://localhost:5000/api/v1.0/bar_data", function(barData) {
    
    // var category = barData[0].category;

    console.log(barName);
    console.log(barData);
    // console.log(category);
    // bar count
    var barCount = {
      Brewery: 0,
      Distillery: 0,
      wine_bar: 0
    };

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
      else {
        BarCode = "null";
      }

      // Update bar count
      barCount[BarCode]++;

      // makers with icon and coordinates
      var newMarker = L.marker([bar.latitude, bar.longitude], {
        icon: icons[BarCode]
      });

      // add markers to layers
      newMarker.addTo(layers[BarCode]);

      // bind popups
      newMarker.bindPopup("<b>" + bar.name + "</b>"  + "<br> " + bar.address + "<br>" + bar.category + "<br>" + " Rating: " + bar.rating + "<br>" + bar.price + "<br>" + bar.phone);
    }

    // update legend
    // updateLegend(barCount); // need to figure out how to add icons and labels
  });
});

function updateLegend(time, stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
    "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
    "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
    "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
    "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
  ].join("");
}