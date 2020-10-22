var x = [];
for (var i = 0; i < 500; i ++) {
	x[i] = Math.random();
}

var trace = {
    x: x,
    type: 'histogram',
  };
var data = [trace];
Plotly.newPlot('histogram', data);


var y = [];
for (var i = 0; i < 500; i ++) {
	y[i] = Math.random();
}

var data = [
  {
    y: y,
    type: 'histogram',
	marker: {
    color: 'pink',
	},
  }
];
Plotly.newPlot('histogram', data);
