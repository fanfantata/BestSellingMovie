function score(container, cars) {

  var margin = {top: 30, right: 0, bottom: 10, left: 0},
    width = 850 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      background,
      foreground,
      dimensions;

  var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var color = d3.scale.category20();

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    return (d != "Film") && (d != "Budget ($m)") && (d != "Genre") 
        && (d != "Major Studio")  
        && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

            // ["Buena Vista","Crest","Disney","Focus","Fox","Independent",
            // "Liberty Starz","Lionsgate","Mediaplex","MGM","Miramax","New Line",
            // "Overture","Paramount","Relativity Media","Rocky Mountain Pictures",
            // "Sony","Sony Classics","Summit","The Weinstein Company","United International Pictures",
            // "Universal","Village Roadshow Pictures","Warner Bros.","Weinstein Co.", "Highlight Communications", "CBS"
            // ]

            // ["Action", "Adventure", "Animation", "Biography", "Biopic", "Comedy", "Crime",
            // "Documentary", "Drama", "Fantasy", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi",
            // "Thriller", "Western"
            // ]

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(cars)
      .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(cars)
      .enter().append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function(d) { return color(Math.floor(d["Audience Score"]/10)); })
        .on("mouseover", function(d,i){
          d3.select(this)
          .style("stroke-width", 10);

          d3.select("#Film2")
            .text(d["Film"]);
          d3.select("#MajorStudio2")
            .text(d["Major Studio"]);
          d3.select("#Budget2")
            .text(d["Budget ($m)"]);
          d3.select("#Genre2")
            .text(d["Genre"]);
        })
        .on("mouseout",function(d,i){
          d3.select(this)
          .style("stroke-width", 1);

        });

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
      .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { if (isNaN(y[p](d[p]))) {console.log(d[p]);} return [x(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }

}

d3.csv("data.csv", function(error, cars) {

  if(error) {
    throw(error);
  }

  score("#score", cars);

 });
