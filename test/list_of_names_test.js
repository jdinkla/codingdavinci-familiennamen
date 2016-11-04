/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var assert = require('assert');
var lofn = require('../public/javascripts/list_of_names');

describe('list_of_names', function() {

    var a, b, c;

    before(function() {
        a = new lofn.FamilyName('abc');
        b = new lofn.FamilyName('def');
        c = new lofn.FamilyName('ghi');
    });

    it('names_selection is required', function() {
        assert(lofn);
    });

    it('createNameItem(x)', function() {
        var name = 'abc';
        var i = new lofn.FamilyName(name);
        assert.equal(i.name, name);
    });

    it('sortByName()', function() {
        assert.deepEqual([a,b,c], lofn.sortByName([a,b,c]));
        assert.deepEqual([a,b,c], lofn.sortByName([a,c,b]));
        assert.deepEqual([a,b,c], lofn.sortByName([b,a,c]));
        assert.deepEqual([a,b,c], lofn.sortByName([b,c,a]));
        assert.deepEqual([a,b,c], lofn.sortByName([c,a,b]));
        assert.deepEqual([a,b,c], lofn.sortByName([c,b,a]));
    });

    it('ListOfNames #1', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add('abc');
        assert.equal(ls.elems.length, 1);
    });

    it('ListOfNames #2', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name);
        ls.add(b.name);
        ls.add(a.name);
        assert.equal(ls.elems.length, 3);
    });

    it('ListOfNames #3', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);

        ls.add(c.name);
        assert.equal(ls.elems.length, 1);
        assert.deepEqual(ls.elems[0], c);
    });

    it('ListOfNames #x3', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);

        ls.add(c.name);
        assert.equal(ls.elems.length, 1);
        assert.deepEqual(ls.elems[0], c);

        ls.add(b.name);
        assert.equal(ls.elems.length, 2);
        assert.deepEqual(ls.elems[0], b);
        assert.deepEqual(ls.elems[1], c);

        ls.add(a.name);
        assert.equal(ls.elems.length, 3);
        assert.deepEqual(ls.elems[0], a);
        assert.deepEqual(ls.elems[1], b);
        assert.deepEqual(ls.elems[2], c);

    });

    it('findIndex', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name);
        ls.add(b.name);
        ls.add(a.name);
        assert.equal(ls.findIndex(a.name), 0);
        assert.equal(ls.findIndex(b.name), 1);
        assert.equal(ls.findIndex(c.name), 2);
        assert.equal(ls.findIndex('xyz'), -1);
    });

    it('contains', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name);
        ls.add(b.name);
        ls.add(a.name);
        assert.equal(ls.contains(a.name), true);
        assert.equal(ls.contains(b.name), true);
        assert.equal(ls.contains(c.name), true);
        assert.equal(ls.contains('xyz'), false);
    });

    it('delete', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name);
        ls.add(b.name);
        ls.add(a.name);
        assert.equal(ls.elems.length, 3);
        assert.deepEqual(ls.elems[0], a);
        assert.deepEqual(ls.elems[1], b);
        assert.deepEqual(ls.elems[2], c);

        ls.delete(1);
        assert.equal(ls.elems.length, 2);
        assert.deepEqual(ls.elems[0], a);
        assert.deepEqual(ls.elems[1], c);

        ls.delete(1);
        assert.equal(ls.elems.length, 1);
        assert.deepEqual(ls.elems[0], a);

        ls.delete(0);
        assert.equal(ls.elems.length, 0);
    });

    it('reset', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name);
        ls.add(b.name);
        ls.add(a.name);
        assert.equal(ls.elems.length, 3);

        ls.reset();
        assert.equal(ls.elems.length, 0);
    });

    it('isEmpty', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.isEmpty(), true);
        ls.add(c.name);
        assert.equal(ls.isEmpty(), false);
        ls.add(b.name);
        assert.equal(ls.isEmpty(), false);
        ls.reset();
        assert.equal(ls.isEmpty(), true);
    });

    it('getElems', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name);
        ls.add(b.name);
        ls.add(a.name);
        assert.equal(ls.elems.length, 3);
        assert.deepEqual(ls.getElems(), [a.name, b.name, c.name]);
        assert.equal(ls.elems.length, 3);
    });

    it('getColor', function() {
        var ls = new lofn.ListOfNames();
        assert.equal(ls.elems.length, 0);
        ls.add(c.name, 'c3');
        ls.add(b.name, 'c2');
        ls.add(a.name, 'c1');
        assert.equal(ls.getColor(a.name), 'c1');
        assert.equal(ls.getColor(b.name), 'c2');
        assert.equal(ls.getColor(c.name), 'c3');
    });
});


