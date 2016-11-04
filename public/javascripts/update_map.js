/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var updateMap = function(tag, lofn, mapDataFile) {

    var enc = encodeListOfNames(lofn.getElems());

    var radius = 6;

    //Width and height
    var xOffset = 20;
    var yOffset = 400;
    //var xy = d3.min([window.innerHeight - yOffset, window.innerWidth - xOffset]);
    var width = window.innerWidth - xOffset;
    var height = window.innerHeight - yOffset;

    /* Colors */
    var plz_range = d3.scaleLinear()
        .domain([0, 10000])
        .range([0, 1.0]);

    var year_range = d3.scaleLinear()
        .domain([0, 2020])
        .range([0.01, 1.0]);

    var bgFill = function (d, i) {
        return d3.interpolateGreys(0.3 + i/40);
        //return d3.schemePaired[i];
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

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", p.path)
            .attr("fill", bgFill);

        d3.json("/api/map/" + enc, function(error, timeline) {
            if (error) return console.warn(error);

            //Create a circle for each city
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
                .attr("r", radius)
                .attr("fill", fgFill)
                .style("opacity", fgOpacity);

            circles.append("title")
                .text(function (d) {
                    return "" + d.familyName + ", " + d.begin + " - " + d.end + ", " + d.plz + " " + d.placeName + " (" + d.id + ")";
                })

        });

    });

};
