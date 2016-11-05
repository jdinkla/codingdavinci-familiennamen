/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var resetTable = function(dataTag) {
    d3.select(dataTag).selectAll("tr").remove();
}


var updateTable = function(tag, dataTag, lofn) {

    var enc = encodeListOfNames(lofn.getElems());

    d3.json("/api/foko/" + enc, function (err, json) {
        if (err) return console.warn(err);

        $(tag).collapse('show');
        resetTable(dataTag);

        var div = d3.select(dataTag)
            .selectAll("div")
            .data(json)
            .enter().append("tr");

        div.append("td").text(function (d) {
            return d.id;
        });

        div.append("td").append("span").attr("style", function (d) {
            return "color: " + lofn.getColor(d.familyName);
        }).text(function (d) {
            return d.familyName;
        });

        div.append("td").text(function (d) {
            return d.begin;
        });

        div.append("td").text(function (d) {
            return d.end;
        });

        div.append("td").text(function (d) {
            return d.submitter;
        });

        div.append("td").text(function (d) {
            return d.denomination;
        });

        div.append("td").text(function (d) {
            return d.country;
        });

        div.append("td").text(function (d) {
            return d.region;
        });

        div.append("td").text(function (d) {
            return d.postalCode;
        });

        div.append("td").text(function (d) {
            return d.placeName;
        });

        div.append("td").append("a").attr("href", function (d) {
            return d.placeURI;
        }).text(function (d) {
            return d.placeURI;
        });

    });

};
