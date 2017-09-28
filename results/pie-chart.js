var svgPies;

var pie = d3.layout.pie()
  .sort(null)
  .value(function (d) {
    return d.value;
  });

var colorRange = d3.scale.category10();

var width = 960,
  height = 450,
  radius = Math.min(width, height) / 2;

var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0);

var legendRectSize = radius * 0.15;
var legendSpacing = radius * 0.1;

function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

var tooltipBiased = d3.select("body").append("div").attr("class", "toolTip");
var tooltipUnbiased = d3.select("body").append("div").attr("class", "toolTip");

document.addEventListener('DOMContentLoaded', () => {
  svgPies = d3.selectAll(".pies")
    .append("g")

  svgPies.append("g")
    .attr("class", "slices");
  svgPies.append("g")
    .attr("class", "labelName");
  svgPies.append("g")
    .attr("class", "labelValue");
  svgPies.append("g")
    .attr("class", "lines");

  svgPies.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
})

function sliceBehavior(slice, tooltip, color) {
  slice.enter()
    .insert("path")
    .style("fill", function (d) { return color(d.data.label); })
    .attr("class", "slice");

  slice
    .transition().duration(1000)
    .attrTween("d", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        return arc(interpolate(t));
      };
    })
  slice
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 25 + "px");
      tooltip.style("display", "inline-block");
      tooltip.html((d.data.label) + "<br>" + (d.data.value));
    });
  slice
    .on("mouseout", function (d) {
      tooltip.style("display", "none");
    });

  slice.exit()
    .remove();
}

function legendBehavior(ofPieGraph, color) {
  ofPieGraph.selectAll('.legend').remove();

  var legend = ofPieGraph.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = height * color.domain().length / 2;
      var horz = 0;
      var vert = i * height + offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing + 12)
    .text(function (d) { return d; });
}

function change(biased, unbiased) {

  biasedPie = d3.select("#biased");
  unbiasedPie = d3.select("#unbiased");

  const biasedColor = d3.scale.ordinal()
  .range(colorRange.range());
  const unbiasedColor = d3.scale.ordinal()
  .range(colorRange.range());

  /* ------- PIE SLICES -------*/
  const biasedSlices = biasedPie.select(".slices").selectAll("path.slice")
    .data(pie(biased), function (d) { return d.data.label });

  const unbiasedSlices = unbiasedPie.select(".slices").selectAll("path.slice")
    .data(pie(unbiased), function (d) { return d.data.label });

  sliceBehavior(biasedSlices, tooltipBiased, biasedColor);
  sliceBehavior(unbiasedSlices, tooltipUnbiased, unbiasedColor);

  legendBehavior(biasedPie, biasedColor);
  legendBehavior(unbiasedPie, unbiasedColor);
};