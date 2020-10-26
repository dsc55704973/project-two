// bar name dropdown menu
d3.json("http://localhost:5000/api/v1.0/bar_names").then(barName => {
  console.log(barName);
  dropDown(barName);
});

// function dropDown(barName) {
//   var dropDown = d3.select("#barDropdown");
//   barName.forEach((name) => {

// dropDown.append("option").text(name).attr("value", name);
//     });
//   };



