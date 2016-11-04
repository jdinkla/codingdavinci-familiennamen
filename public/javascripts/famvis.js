/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

angular.module('FamVis', []);

angular
    .module('FamVis')
    .controller('explorerController', function($scope, $http) {

        $scope.lofn = new ListOfNames();

        $scope.searchText = "";
        $scope.searchType = 1;

        $scope.searchTexts = ['Suche exakt', 'Suche nach Like-Muster', 'Suche nach regulärem Ausdruck', 'Suche ähnliche Namen in Graph'];
        $scope.searchButtonText = $scope.searchTexts[0];
        $scope.setSearchButtonText = function() {
            $scope.searchButtonText = $scope.searchTexts[$scope.searchType-1];
        };

        $scope.searchResults = [];
        $scope.numSearchResults = -1;

        $scope.mapDataFiles = [
            { text: "Bundesländer", file: '/data/d_mit_bundeslaendern.json'},
            { text: "PLZ-Gebiete, einstellig", file: '/data/plz1.json'},
            { text: "PLZ-Gebiete, zweistellig", file: '/data/plz2.json' } ];
        $scope.mapDataFile = $scope.mapDataFiles[0];

        $scope.neighbors = 1;

        $scope.search = function() {

            $scope.searchResults = [];
            $scope.numSearchResults = 0;

            var pattern = encode($scope.searchText);
            switch(+$scope.searchType) {
                case 1:
                    $http.get("/api/name/" + pattern )
                        .then(function(res) {
                            $scope.searchResults = res.data;
                            $scope.numSearchResults = res.data.length;
                        });
                    break;
                case 2:
                    $http.get("/api/name/like/" + pattern )
                        .then(function(res) {
                            $scope.searchResults = res.data;
                            $scope.numSearchResults = res.data.length;
                        });
                    break;
                case 3:
                    $http.get("/api/name/regexp/" + pattern )
                        .then(function(res) {
                            $scope.searchResults = res.data;
                            $scope.numSearchResults = res.data.length;
                        });
                    break;
                case 4:
                    $http.get("/api/graph1/" + pattern )
                        .then(function(res) {
                            var nodes = res.data.nodes.slice();
                            var names = nodes.map(function(n) { return n.id; });
                            var idx = names.indexOf(pattern);
                            if (idx > -1) {
                                names.splice(idx, 1);
                            }
                            $scope.searchResults = names;
                            $scope.numSearchResults = names.length;
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

            $scope.updateGraph = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateGraph("#graph", $scope.lofn, $scope.neighbors);
                }
            };

            $scope.updateData = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateTable("#table", "#table_data", $scope.lofn, $scope.neighbors);
                }
            };

            $scope.updateTimeline = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateTimeline("#timeline", $scope.lofn, '#timeline-container');
                }
            };

            $scope.updateMap = function() {
                if (!$scope.lofn.isEmpty()) {
                    updateMap("#map", $scope.lofn, $scope.mapDataFile.file);
                }
            };

        };
    });
