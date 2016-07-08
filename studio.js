d3.csv("data.csv", function(error, data) { 
   if (error) throw error;
 var graphmargin = {top: 20, right: 100, bottom: 30, left: 40},
    graphwidth = 800 - graphmargin.left - graphmargin.right,
    graphheight = 600 - graphmargin.top - graphmargin.bottom;
    

 var x = d3.scale.linear()
    .domain([2006.5,2010.5])
    .range([0, graphwidth]);

 var y = d3.scale.linear()
    .domain([0,40])
    .range([graphheight,0]);

 var color = d3.scale.category20();

 var radius = d3.scale.linear()
    .domain([0,3000])
    .range([5,30]);
    
 var tempX = [];    

 var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

 var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

 //pie

  var piemargin = {top:20, right: 0, bottom: 30, left: 800},
    piewidth = 1200 - piemargin.left - piemargin.right,
    pieheight = 750 - piemargin.top - piemargin.bottom;
    
  var colorpie = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); 
  var arcradius = Math.min(piewidth-300, pieheight) / 2;

  var outerRadius = arcradius - 40;
 
  var arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(100);

  var pie = d3.layout.pie();    
 
 
 // left graph
 var svg = d3.select("#major_studio").append("svg")
    .attr("width", 1900)
    .attr("height", graphheight + graphmargin.top + graphmargin.bottom)
 var graphsvg = svg.append("g")
    .attr("transform", "translate(" + graphmargin.left + "," + graphmargin.top + ")");
 
 

  graphsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + graphheight + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", graphwidth)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  graphsvg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Market Profitability ratio");

  var circle = graphsvg.selectAll(".circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class","circle")
      .attr("r", function (d) { return radius(d["Worldwide Gross ($m)"]); })
      .attr("cx", function(d) { tempX[d] = d.Year-Math.random()/2+ Math.random()/3; return x(tempX[d]) ; })
      .attr("fill", function(d) { return color(d["Major Studio"]); })
      .attr("fill-opacity", ".5")
      .attr("cy", function(d) { return y(d["Market Profitability"]); })
      .on("mouseover", mouseover)
      .on("mouseout",mouseout);
                  
      
  var legend = graphsvg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", graphwidth+70)
      .attr("width", 18)
      .attr("height", 18)
      .on("mouseover", function(){
        var color = d3.select(this).style("fill");
        graphsvg.selectAll(".circle").each(function() {
          var circle = d3.select(this);
          var circleColor = circle.style("fill");
          if(circleColor == color) {
            circle.style("fill-opacity", "0.95");
          }
          else {
            circle.style("fill-opacity", "0.05");
          }

        })})
      .on("mouseout", function(){
        graphsvg.selectAll(".circle").each(function() {
          var circle = d3.select(this);
            circle.style("fill-opacity", "0.5");
        })})
      .style("fill", color)
      .style("fill-opacity", ".5");;

  legend.append("text")
      .attr("x", graphwidth+66)
      .attr("y", 9)
      .attr("dx", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  
 // drawpie(50,60);
      
  
 drawpie(72.23,89.40);
   

      
function drawpie(a1,a2){

  var dataset=[a1,a2];

  var piesvg= svg.append("g")
    .attr("transform","translate("+ (piemargin.left+piewidth/2) +","+ (piewidth/2) +")");    
    
      
  var piearc = piesvg.selectAll("path")
      .data(pie(dataset))
      .enter();
      
     piearc.append("path")
      .attr("d",arc)
      .style("fill", 
            function(d,i){return colorpie(i);}
            )
 //     .style("fill-opacity",0.8)
    .attr("d",function(d){
        return arc(d);
      });
    
   piearc.append("text")
      .attr("transform",function(d){
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor","middle")
      .text(function(d){
        return d.data;
      });
    
    console.log(dataset);
    console.log(pie(dataset));

      var legendpie1 = piesvg.selectAll(".legend")
      .data(["Domestic Gross ($m)","Foreign Gross ($m)"])
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
  legendpie1.append("rect")
      .attr("x", -100)
      .attr("y", 200)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorpie)
      .style("fill-opacity", ".5");
      

  legendpie1.append("text")
      .attr("x", -30)
      .attr("y", 210)
      .attr("dx", "0.2em")
      .style("text-anchor", "middle")
      .text(function (d) {return d;});

 }       
  function mouseover(d,i){
              d3.select(this)
                .attr("fill-opacity","1");
              
              drawpie(d["Domestic Gross ($m)"],d["Foreign Gross ($m)"]);
              
                ;}   
  function mouseout (d,i){
            d3.select(this)
              .transition()
              .duration(500)
              .attr("fill-opacity",".5");

              drawpie(72.23,89.40);
  }
  function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        

});