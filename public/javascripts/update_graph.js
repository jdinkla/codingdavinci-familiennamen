/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var updateGraph = function(tag, lofn, neighbors) {

    console.log("updateGraph " + neighbors);

    var enc = encodeListOfNames(lofn.getElems());

    //Width and height
    var xOffset = 20;
    var yOffset = 400;
    var width = document.getElementById('container').offsetWidth - xOffset;
    var height = 600; //document.getElementById('container').offsetHeight;
    var padding = 10;

    deleteAllChilds(detag(tag));

    var svg = d3.select(tag)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var ld = 100;

    function fgFill(d) {
        return lofn.getColor(d.id);
    };

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("/api/graphs" + neighbors + "/" + enc, function (error, graph) {
        if (error) return console.warn(error);

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function (d) {
                return Math.sqrt(d.weight);
            });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("fill", fgFill)
            //.attr("stroke", "#fff")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("circle")
            .attr("r", function(d) {
            if (lofn.contains(d.id)) {
                return 10;
            } else {
                return 5;
            }
        });

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .attr("fill", fgFill)
            .text(function(d) {
                return d.id;
            });

        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .distance(200)
            .links(graph.links);

        function ticked() {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            /*node.attr("cx", function (d) { return d.x; })
             .attr("cy", function (d) { return d.y; });
             */
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    });

};
