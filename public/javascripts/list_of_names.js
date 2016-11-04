/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

function FamilyName(name, color) {
    this.name = name;
    this.color = color;
}

// changes ls
function sortByName(ls) {
    return ls.sort(function (x, y) {
        if (x.name < y.name) return -1
        else if (x.name > y.name) return 1
        else 0;
    });
}

function ListOfNames() {

    this.elems = [];

    this.add = function(name, color) {
        this.elems.push(new FamilyName(name, color));
        sortByName(this.elems);
    };

    this.findIndex = function(name) {
        return this.elems.findIndex(function (elem, idx, arr) {
            return (elem.name == name);
        });
    };

    this.contains = function(name) {
        return this.findIndex(name) > -1;
    };

    this.delete = function(idx) {
        this.elems.splice(idx, 1);
    };

    this.reset = function() {
        this.elems = [];
    };

    this.isEmpty = function() {
        return this.elems.length == 0;
    };

    this.getElems = function() {
        return this.elems.map(function(n) { return n.name; });
    };

    this.getColor = function(name) {
        var idx = this.findIndex(name);
        if (idx > -1) {
            return this.elems[idx].color;
        } else {
            return undefined;
        }
    };

}

if (typeof module != 'undefined') {
    module.exports = {
        FamilyName: FamilyName,
        ListOfNames: ListOfNames,
        sortByName: sortByName
    };
}


