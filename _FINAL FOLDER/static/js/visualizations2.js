// make responsive
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // styling
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 20,
    bottom: 60,
    right: 100,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // SVG wrapper
  var svg = d3
    .select("#review-rating")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // import data
  d3.json("http://localhost:5000/api/v1.0/bar_data", function(barData) {
      console.log(barData);

      // parse Data/Cast as numbers
      barData.forEach(function(data) {
        data.rating = +data.rating;
        data.review_count = +data.review_count;
      });


      // scale functions
      var xLinearScale = d3.scaleLinear()
        .domain([3, d3.max(barData, d => d.rating)])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.review_count)])
        .range([height, 0]);

      // axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      // Circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(barData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.rating))
      .attr("cy", d => yLinearScale(d.review_count))
      .attr("r", "10")
      .attr("fill", "pink")
      .attr("opacity", ".5");

      // tool tip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.name}<br>Rating: ${d.rating}<br>Review Count: ${d.review_count}`);
        });
      chartGroup.call(toolTip);

      // event listener
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      // axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Bar Review Count");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Rating");
  // error
  }).catch(function(error) {
    console.log(error);
  });
};

// call makeResponsive 
makeResponsive();
d3.select(window).on("resize", makeResponsive)

