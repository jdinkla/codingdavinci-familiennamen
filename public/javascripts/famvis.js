/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

angular.module('FamVis', []);

angular
    .module('FamVis')
    .controller('explorerController', function($scope, $http) {

        var minimalCharsinLike = 3;
        var minimalCharsinRegExp = 4;

        $scope.error = "";

        $scope.lofn = new ListOfNames();

        $scope.scale = { x: 1.0, y: 0.7 };

        $scope.scales = [];
        for (var i=1; i<= 20; i++) {
            $scope.scales.push(i / 10.0);
        }

        // Sizes
        $scope.sizeMapElem = 7;
        $scope.sizeGraphElem = 5;
        $scope.elemSize = { x: 20, y: 25 };

        $scope.sizes = [];
        $scope.sizesLarge = [];
        for (var i=1; i<=20; i++) {
            $scope.sizes.push(i);
        }
        for (var i=5; i<=50; i+= 5) {
            $scope.sizesLarge.push(i);
        }

        // Search
        $scope.searchText = "";
        $scope.searchType = 1;

        $scope.searchTexts = ['Suche exakt', 'Suche nach Like-Muster', 'Suche nach regulärem Ausdruck', 'Suche ähnliche Namen in Graph'];
        $scope.searchButtonText = $scope.searchTexts[0];
        $scope.setSearchButtonText = function() {
            $scope.searchButtonText = $scope.searchTexts[$scope.searchType-1];
        };

        $scope.startSearch = function() {
            var elem = $('#searchButton');
            elem.removeClass(minus);
            elem.addClass('glyphicon-refresh');
            elem.addClass('glyphicon-refresh-animate');
            $scope.searchButtonText = "Suche läuft"
        }

        $scope.stopSearch = function() {
            var elem = $('#searchButton');
            elem.removeClass('glyphicon-refresh');
            elem.removeClass('glyphicon-refresh-animate');
            $scope.setSearchButtonText();
        }

        $scope.searchResults = [];
        $scope.numSearchResults = 0;

        $scope.mapDataFiles = [
            { text: "Bundesländer", file: '/data/d_mit_bundeslaendern.json'},
            { text: "PLZ-Gebiete, einstellig", file: '/data/plz1.json'} ];
        $scope.mapDataFile = $scope.mapDataFiles[0];

        $scope.neighbors = 1;

        $scope.error = function(show) {
            if (show) {
                $('#error').removeClass("hidden");
            } else {
                $('#error').addClass("hidden");
            }
        };

        $scope.warning = function(show, text) {
            if (show) {
                $('#warning').removeClass("hidden");
                if (text) {
                    document.getElementById('warning-text').innerText = text;
                }
            } else {
                $('#warning').addClass("hidden");
            }
        };


        $scope.search = function() {

            $scope.searchResults = [];
            $scope.numSearchResults = 0;

            $scope.error(false);
            $scope.warning(false);

            var pattern = encode($scope.searchText);
            switch(+$scope.searchType) {
                case 1:
                    $scope.startSearch();
                    $http.get("/api/name/" + pattern )
                        .error(function () {
                            $scope.error(true);
                            $scope.stopSearch();
                        })
                        .then(function(res) {
                            $scope.searchResults = res.data;
                            $scope.numSearchResults = res.data.length;
                            $scope.stopSearch();
                        });
                    break;
                case 2:
                    if (getAlphaNumChars($scope.searchText).length < minimalCharsinLike) {
                        $scope.warning(true, "Ein Like-Muster muss mindestens " + minimalCharsinLike + " normale Zeichen beinhalten.")
                    } else {
                        $scope.startSearch();
                        $http.get("/api/name/like/" + pattern )
                            .error(function () {
                                $scope.error(true);
                                $scope.stopSearch();
                            })
                            .then(function(res) {
                                $scope.searchResults = res.data;
                                $scope.numSearchResults = res.data.length;
                                $scope.stopSearch();
                            });
                    }
                    break;
                case 3:
                    if (getAlphaNumChars($scope.searchText).length < minimalCharsinRegExp) {
                        $scope.warning(true, "Ein regulärer Ausdruck muss mindestens" + minimalCharsinRegExp + " normale Zeichen beinhalten.")
                    } else {
                        $scope.startSearch();
                        $http.get("/api/name/regexp/" + pattern)
                            .error(function () {
                                $scope.error(true);
                                $scope.stopSearch();
                            })
                            .then(function (res) {
                                $scope.searchResults = res.data;
                                $scope.numSearchResults = res.data.length;
                                $scope.stopSearch();
                            });
                    }
                    break;
                case 4:
                    $scope.startSearch();
                    $http.get("/api/graph1/" + pattern )
                        .error(function () {
                            $scope.error(true);
                            $scope.stopSearch();
                        })
                        .then(function(res) {
                            var nodes = res.data.nodes.slice();
                            var names = nodes.map(function(n) { return n.id; });
                            var idx = names.indexOf(pattern);
                            if (idx > -1) {
                                names.splice(idx, 1);
                            }
                            $scope.searchResults = names;
                            $scope.numSearchResults = names.length;
                            $scope.stopSearch();
                        });
                    break;
                default:
                    break;
            };

            $scope.addName = function(str) {
                if (!$scope.lofn.contains(str)) {
                    $scope.lofn.add(str, randomColor());
                }
            };

            $scope.copyName = function(str) {
                $scope.searchText = str;
            };

            $scope.copyNameIndex = function(idx) {
                $scope.searchText = $scope.lofn.elems[idx].name;
            };

            $scope.removeName = function(idx) {
                $scope.lofn.delete(idx);
            };

            $scope.resetSearch = function() {
                $scope.searchResults = [];
                $scope.numSearchResults = 0;
            };

            $scope.resetList = function() {
                $scope.lofn.reset();
            };

            /* ----- Data ----- */
            $scope.updateData = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateTable("#table", "#table_data", $scope.lofn, $scope.neighbors);
                }
            };

            $scope.resetData = function() {
                resetTable("#table_data");
            };

            /* ----- Graph ----- */
            $scope.updateGraph = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateGraph("#graph", $scope.lofn, $scope.neighbors, $scope.sizeGraphElem, $scope.scale);
                }
            };

            $scope.resetGraph = function() {
                deleteAllChilds("graph");
            };


            /* ----- Timeline ----- */
            $scope.updateTimeline = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateTimeline("#timeline", $scope.lofn, '#timeline-container', $scope.elemSize, $scope.scale);
                }
            };

            $scope.resetTimeline = function() {
                deleteAllChilds("timeline");
            };


            /* ----- Map ----- */
            $scope.updateMap = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateMap("#map", $scope.lofn, $scope.mapDataFile.file, $scope.sizeMapElem, $scope.scale);
                }
            };

            $scope.resetMap = function() {
                deleteAllChilds("map");
            };

        };
    });
