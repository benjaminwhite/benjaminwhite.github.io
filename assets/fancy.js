$(document).ready(function() {
  var cell = 80,
      step = cell/2,
      shortName = "BENWHITE"
      longName = "BENJAMIN WHITE"
      radian = Math.PI/180,
      gridMajorDelay = 250,
      gridMajorDuration = 250,
      gridMinorDelay = gridMajorDelay + 650 + gridMajorDuration,
      gridMinorDuration = 500,
      //circleDelay = gridMajorDelay + gridMajorDuration +
                    //gridMinorDelay + gridMinorDuration - 250,
      circleDelay = gridMinorDelay + gridMinorDuration,
      circleDuration = 500;

  $(window).load(function() {
    drawGrid();
    centerG();
    drawCircles();
    setTimeout(drawName, gridMinorDelay + gridMinorDuration);
  });

  $(window).resize(function() {
    drawGrid();
    centerG();
  });

  function centerG() {
    d3.select("g").attr("transform", "translate(" + $("#cover").width()/2 + ", 0)")
  }

  function drawName() {
    var width = $("#cover").width(),
        height = $("#cover").height(),
        xOffset = (width % (2 * cell))/2,
        yOffset = step;

    if (width >= 580) {
      var name = longName;
    } else {
      var name = shortName;
    }

    var xBlock = step/6;
    var yBlock = cell/10;
    var radius = 3;
    var xStart = -step*name.length/2;
    var yStart = yOffset + 5*step;
    var blank = "000000000000000000000000000000000000000000000";
    var dotmatrix = {
        "B": "000001111010001100011111010001100011111000000",
        "E": "000001111110000100001111010000100001111100000",
        "N": "000001000110001110011010110011100011000100000",
        "J": "000000111100001000010000100001100010111000000",
        "A": "000000011101001100011000111111100011000100000",
        "M": "000001000111011101011010110001100011000100000",
        "W": "000001000110001100011010110101110111000100000",
        "H": "000001000110001100011111110001100011000100000",
        "I": "000001111100100001000010000100001001111100000",
        "T": "000001111100100001000010000100001000010000000",
        " ": "000000000000000000000000000000000000000000000"
    }
    var svg = d3.select("#cover").select("g");
    function drawLetter(letter, l) {
      var matrix = svg.selectAll(".letter-" + l).data(letter.split(""));
      matrix.enter().append("circle").attr("class", "letter-" + l);
      matrix.attr("cx", function(d, i) { return xStart+l*step + xBlock*(i%5+1); })
        .attr("cy", function(d, i) { return yStart+yBlock*Math.floor(i/5+1); })
        .attr("opacity", function(d) {
          if (d == "1") {
            return 0.70;
          } else if (d == "0") {
            return 0.10;
          } else {
            return 0;
          }
        })
        .attr("fill", "#F8FFC4")
        .attr("r", radius);
    }
    var m = Math.floor(name.length/2)-1,
        n = m + 2,
        w = 9,
        interval = null;

    interval = setInterval(function(){
      if (n-m <= name.length) {
        for(var z = m; z < n; z++){
          drawLetter(blank, z);
        }
        m--;
        n++;
      } else {
        if (w >= 0) {
          for(var l = 0; l < name.length; l++) {
            var letter = dotmatrix[name.charAt(l)];
            letter = (letter.substring(5*w, 45) + blank).substring(0, 45);
            drawLetter(letter, l);
          }
          w--;
        } else {
          clearInterval(interval);
        }
      }
    }, 90);
  }

  function drawCircles(){
    var width = $(window).width(),
        height = $(window).height(),
        xOffset = (width % (2 * cell))/2,
        yOffset = step;

    var svg = d3.select("#cover").select("g");

    var arc = d3.svg.arc();

    var arcs = [{startAngle: 90*radian, endAngle: 90*radian, travel: 180*radian,
                innerRadius: cell-2, outerRadius: cell, xShift: 0,
                yShift: yOffset+cell, arcClass: 'img-circle', delay: circleDelay},
                {startAngle: 270*radian, endAngle: 270*radian, travel: 180*radian,
                innerRadius: cell-2, outerRadius: cell, xShift: 0,
                yShift: yOffset+cell, arcClass: 'img-circle', delay: circleDelay},
                {startAngle: 270*radian, endAngle: 270*radian, travel: -360*radian,
                innerRadius: step-2, outerRadius: step, xShift: 4*step,
                yShift: yOffset+cell, arcClass: 'logo-circle',
                delay: circleDelay + circleDuration},
                {startAngle: 90*radian, endAngle: 90*radian, travel: -360*radian,
                innerRadius: step-2, outerRadius: step, xShift: -4*step,
                yShift: yOffset+cell, arcClass: 'logo-circle',
                delay: circleDelay + circleDuration}];

    svg.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("transform", function(d) {
        return "translate(" + d.xShift + "," + d.yShift + ")";
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

    var svg = d3.select("#grid");
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
});
