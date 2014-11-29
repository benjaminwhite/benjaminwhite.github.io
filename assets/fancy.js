$(document).ready(function() {
  $(window).load(drawElements);
  $(window).resize(drawGrid);
});

var cell = 80,
    step = cell/2,
    shortName = "BEN WHITE"
    longName = "BENJAMIN WHITE"
    radian = Math.PI/180,
    gridMajorDelay = 250,
    gridMajorDuration = 250,
    gridMinorDelay = gridMajorDelay + 650 + gridMajorDuration,
    gridMinorDuration = 500,
    circleDelay = gridMajorDelay + gridMajorDuration +
                  gridMinorDelay + gridMinorDuration - 250,
    circleDuration = 500;

function drawElements() {
  drawGrid();
  drawCircles();
}

function drawName() {
}

function drawCircles(){
  var width = $(window).width(),
      height = $(window).height(),
      xOffset = (width % (2 * cell))/2,
      yOffset = step;

  var svg = d3.select("body").select("svg");

  var arc = d3.svg.arc();

  var arcs = [{startAngle: 90*radian, endAngle: 90*radian, travel: 180*radian,
               innerRadius: cell-2, outerRadius: cell, xShift: 0,
               yShift: yOffset+cell, arcClass: 'img-circle', delay: circleDelay},
              {startAngle: 270*radian, endAngle: 270*radian, travel: 180*radian,
               innerRadius: cell-2, outerRadius: cell, xShift: 0,
               yShift: yOffset+cell, arcClass: 'img-circle', delay: circleDelay},
              {startAngle: 270*radian, endAngle: 270*radian, travel: -360*radian,
               innerRadius: step-2, outerRadius: step, xShift: 5*step,
               yShift: yOffset+cell, arcClass: 'logo-circle',
               delay: circleDelay + circleDuration},
              {startAngle: 90*radian, endAngle: 90*radian, travel: -360*radian,
               innerRadius: step-2, outerRadius: step, xShift: -5*step,
               yShift: yOffset+cell, arcClass: 'logo-circle',
               delay: circleDelay + circleDuration}];

  svg.selectAll("path")
     .data(arcs)
     .enter()
     .append("path")
     .attr("d", arc)
     .attr("transform", function(d) {
       return "translate(" + (width/2 + d.xShift) + "," + d.yShift + ")";
     })
     .attr("class", function(d) { return d.arcClass; })
     .transition()
     .delay(function(d) { return d.delay; })
     .duration(circleDuration)
     .call(function(transition){
       transition.attrTween("d", function(d){
         var interpolate = d3.interpolate(d.endAngle, d.endAngle+d.travel);
         return function(t){d.endAngle = interpolate(t); return arc(d);}
       });
     });
}

function drawGrid(){
  var width = $(window).width(),
      height = $(window).height(),
      xOffset = (width % (2 * cell))/2,
      yOffset = step;

  var grid = [];
  for (var x = xOffset % step; x <= width; x += step) {
    for (var y = yOffset % step; y <= height; y += step) {
      grid.push([x, y]);
    }
  }

  function majorOrMinor(d) {
    return (d[0] - xOffset) % cell == 0 && (d[1] - yOffset) % cell == 0;
  }

  var svg = d3.select("body").select("svg");
  var circles = svg.selectAll("circle").data(grid);

  circles.exit().remove();
  circles.enter().append("circle").attr("r", 0);

  circles.attr("cx", function(d) { return d[0]; })
          .attr("cy", function(d) { return d[1]; });

  circles.filter(majorOrMinor)
          .attr("class", "grid-major") 
          .transition()
          .delay(function(d){ return gridMajorDelay + d[1]; })
          .duration(gridMajorDuration)
          .attr("r", 2);

  circles.filter(function(d){ return !majorOrMinor(d); })
          .attr("class", "grid-minor")
          .transition()
          .delay(gridMinorDelay)
          .duration(gridMinorDuration)
          .attr("r", 1);
}
