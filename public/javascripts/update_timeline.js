/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var updateTimeline = function(tag, lofn, containerId, elemSize, scale) {

    var elemDistance = 5;

    var enc = encodeListOfNames(lofn.getElems());

    var sizes = getSizes();
    var width = scale.x * sizes.width;
    var height = scale.y * sizes.height;

    var timelineWidth = width * (10.0/12.0);
    var xOffset = width / 12.0;

    var elemOffset = elemSize.x / 2;

    var numNames = lofn.elems.length;

    var xScale = d3.scaleLinear()
        .range([xOffset, timelineWidth]);

    var year_range = d3.scaleLinear()
        .domain([0, 2020])
        .range([0.01, 1.0]);

    deleteAllChilds(detag(tag));

    var svg = d3.select(tag)
        .append("svg")
        .attr("width", width);

    $(tag).collapse('show');

    var formatYear = d3.format(" 4");

    var names = {};

    function fgFill(d) {
        return lofn.getColor(d.name);
    };

    d3.json("/api/timeline/" + enc, function (error, timeline) {
        if (error) return console.warn(error);

        svg.attr("height", (numNames+1) * elemSize.y);

        // Calculate the time interval and adapt the year_range
        var times = timeline.map(function (d) {
            return +d.begin;
        });
        var minYear = d3.min(times);
        var maxYear = d3.max(times);

        year_range.domain([minYear, maxYear]);
        var years = getYears(minYear, maxYear);

        xScale.domain([minYear, maxYear]);

        var xAxis = d3.axisBottom()
            .ticks(years.length)
            .tickValues(years)
            .tickFormat(formatYear)
            .scale(xScale);

        var rects = svg.selectAll("rect")
            .data(timeline)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(+d.begin) - elemOffset;
            })
            .attr("y", function (d) {
                return elemSize.y * lofn.findIndex(d.name);
            })
            .attr("width", elemSize.x)
            .attr("height", function (d) {
                return elemSize.y - elemDistance;
            })
            .attr("fill", fgFill);

        rects.append("title")
            .text(function (d) {
                return "" + d.name + ", " + d.begin + "-" + d.end + ", " + d.plz + " " + d.ort + " (" + d.id + ")";
            });

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 0 + ", " + numNames * elemSize.y + ")")
            .call(xAxis);

    });

}
