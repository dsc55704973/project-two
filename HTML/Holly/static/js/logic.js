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
    iconColor: "yellow",
    markerColor: "yellow",
    shape: "star"
  }),
  Distillery: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "white",
    shape: "star"
  }),
  wine_bar: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "red",
    markerColor: "red",
    shape: "star"
  }),
};

// API call here (need help connecting to flask app and connecting flask app to SQL)
// grab names
d3.json("http://localhost:5000/api/v1.0/bar_names", function(barName) {

  // second call to grab bar data
  d3.json("http://localhost:5000/api/v1.0/bar_data", function(barData) {
    var bar_name = barName.bar_names;
    var latitude = barData.latitude;
    var longitude = barData.longitude;
    var rating = barData.rating;
    var category = barData.category;
    var address = barData.address;
    var zip_code = barData.zip_code;

    console.log(barName)
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
      var bar = Object.assign({}, barName[i]);

      // BarCode: Brewery
      if (category == "Brewery") {
        BarCode = "Brewery";
      }
      // BarCode: Distillery
      else if (category == "Distillery") {
        BarCode = "Distillery";
      }
      // BarCode: Wine Bar
      else if (category == "Wine Bar") {
        BarCode = "wine_bar";
      }

      // Update bar count
      barCount[BarCode]++;
      console.log(bar);
      // makers with icon and coordinates
      var newMarker = L.marker([bar.latitude, bar.longitude], {
        icon: icons[BarCode]
      });

      // add markers to layers
      newMarker.addTo(layers[BarCode]);

      // bind popups
      newMarker.bindPopup(bar.bar_name + "<br> : " + bar.address + "<br>" + bar.category + "<br>" + bar.rating);
    }

    // update legend
    updateLegend(barCount); // need to figure out how to add icons and labels
  });
});
