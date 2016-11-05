/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var updateTimeline = function(tag, lofn, containerId, boxWidth, elemHeight) {

    var enc = encodeListOfNames(lofn.getElems());

    //Width and height
    var xOffset = 20;
    var yOffset = 400;
    //var width = $(containerId).offsetWidth - xOffset;
    var width = 1000;
    // var height = $(containerId).offsetHeight;
    var height = 1000;
    var padding = 10;

    var numNames = lofn.elems.length;
    var elemDistance = 5;

    var year_range = d3.scaleLinear()
        .domain([0, 2020])
        .range([0.01, 1.0]);

    deleteAllChilds(detag(tag));

    var svg = d3.select(tag)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    $(tag).collapse('show');

    var formatYear = d3.format(" 4");

    var names = {};

    function fgFill(d) {
        return lofn.getColor(d.name);
    };


    d3.json("/api/timeline/" + enc, function (error, timeline) {
        if (error) return console.warn(error);

        svg.attr("height", numNames * elemHeight + elemHeight);

        // Calculate the time interval and adapt the year_range
        var times = timeline.map(function (d) {
            return +d.begin;
        });
        //console.log(times);
        var minYear = d3.min(times);
        var maxYear = d3.max(times);

        //console.log([minYear, maxYear]);
        year_range.domain([minYear, maxYear]);
        var years = getYears(minYear, maxYear);
        //console.log(years);

        //Set scale for x-axis
        var xScale = d3.scaleLinear()
            .range([padding, width - padding])
            .domain([minYear, maxYear]);

        //Define x-axis
        var xAxis = d3.axisBottom()
            .ticks(years.length)
            .tickValues(years)
            .tickFormat(formatYear)
            .scale(xScale);

        // Create the timeline
        var rects = svg.selectAll("rect")
            .data(timeline)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(+d.begin);
            })
            .attr("y", function (d) {
                return elemHeight * lofn.findIndex(d.name);
            })
            .attr("width", boxWidth)
            .attr("height", function (d) {
                return elemHeight - elemDistance;
            })
            .attr("fill", fgFill);

        rects.append("title")
            .text(function (d) {
                return "" + d.name + ", " + d.begin + "-" + d.end + ", " + d.plz + " " + d.ort + " (" + d.id + ")";
            });

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 0 + ", " + numNames * elemHeight + ")")
            .call(xAxis);

    });

}
