/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var updateMap = function(tag, lofn, mapDataFile, radiusOfElem, scale) {

    var enc = encodeListOfNames(lofn.getElems());

    var sizes = getSizes();
    var width = scale.x * sizes.width;
    var height = scale.y * sizes.height;

    var bgFill = function (d, i) {
        return d3.interpolateGreys(0.3 + i/40);
    };

    var fgFill = function(d) {
        return lofn.getColor(d.familyName);
    }
    var fgOpacity = function (d) {
        return 1.0;
    };

    deleteAllChilds(detag(tag));

    var svg = d3.select(tag)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    $(tag).collapse('show');

    d3.json(mapDataFile, function (error, json) {
        if (error) return console.warn(error);

        var p = getPandP(150, width, height, json);

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", p.path)
            .attr("fill", bgFill);

        d3.json("/api/map/" + enc, function(error, timeline) {
            if (error) return console.warn(error);

            var circles = svg.selectAll("circle")
                .data(timeline)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return p.projection([d.lon, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return p.projection([d.lon, d.lat])[1];
                })
                .attr("r", radiusOfElem)
                .attr("fill", fgFill)
                .style("opacity", fgOpacity);

            circles.append("title")
                .text(function (d) {
                    return "" + d.familyName + ", " + d.begin + " - " + d.end + ", " + d.plz + " " + d.placeName + " (" + d.id + ")";
                })

        });

    });

};
