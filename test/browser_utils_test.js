/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var assert = require('assert');
var utils = require('../public/javascripts/browser_utils');

describe('browser_utils', function() {

    it('utils is required', function() {
        assert(utils);
    });

    it('getCenturies(1431, 1887)', function() {
        var ys = utils.getCenturies(1431, 1887);
        assert.deepEqual(ys, [1500, 1600, 1700, 1800]);
    });

    it('getCenturies(1481, 1800)', function() {
        var ys = utils.getCenturies(1481, 1800);
        assert.deepEqual(ys, [1500, 1600, 1700, 1800]);
    });

    it('getCenturies(1499, 1800)', function() {
        var ys = utils.getCenturies(1499, 1800);
        assert.deepEqual(ys, [1500, 1600, 1700, 1800]);
    });

    it('getCenturies(1500, 1800)', function() {
        var ys = utils.getCenturies(1500, 1800);
        assert.deepEqual(ys, [1500, 1600, 1700, 1800]);
    });

    it('getCenturies(1501, 1800)', function() {
        var ys = utils.getCenturies(1501, 1800);
        assert.deepEqual(ys, [1600, 1700, 1800]);
    });

    it('getCenturies(1501, 1799)', function() {
        var ys = utils.getCenturies(1501, 1799);
        assert.deepEqual(ys, [1600, 1700]);
    });

    it('getYears(1431, 1887)', function() {
        var ys = utils.getYears(1431, 1887);
        assert.deepEqual(ys, [1431, 1500, 1600, 1700, 1800, 1887]);
    });

    it('getYears(1431, 1849)', function() {
        var ys = utils.getYears(1431, 1813);
        assert.deepEqual(ys, [1431, 1500, 1600, 1700, 1800]);
    });

    it('getYears(1431, 1850)', function() {
        var ys = utils.getYears(1431, 1850);
        assert.deepEqual(ys, [1431, 1500, 1600, 1700, 1800, 1850]);
    });

    it('getYears(1431, 1851)', function() {
        var ys = utils.getYears(1431, 1851);
        assert.deepEqual(ys, [1431, 1500, 1600, 1700, 1800, 1851]);
    });

    it('getYears(1597, 1834)', function() {
        var ys = utils.getYears(1597, 1834);
        assert.deepEqual(ys, [1597, 1700, 1800, 1834]);
    });

    it('getYears(1597, 1802)', function() {
        var ys = utils.getYears(1597, 1802);
        assert.deepEqual(ys, [1597, 1700, 1802]);
    });

    it('decode(encode(x)) == x', function() {
        var str = 'abc(def)ghi(jkl)mno';
        var x = utils.encode(str);
        var y = utils.decode(x);
        assert.equal(str, y);
    });

    it('decodeListOfNames(encodeListOfNames(x)) == x', function() {
        var list = ['meier', 'meier, von', 'dubdi()dubdi'];

        var enc = utils.encodeListOfNames(list);
        assert.equal(enc, 'meier%09meier,%20von%09dubdi%28%29dubdi');

        var dec = utils.decodeListOfNames(enc);
        assert.deepEqual(dec, list);
    });

    it('detag', function() {
        assert.equal(utils.detag("#tag"), "tag");
    });

    it('getAlphaNumChars', function() {
        assert.equal(utils.getAlphaNumChars("_%()*."), "");
        assert.equal(utils.getAlphaNumChars("_a%()b*."), "ab");
        assert.equal(utils.getAlphaNumChars(""), "");
        assert.equal(utils.getAlphaNumChars("der%"), "der");

    });


});


