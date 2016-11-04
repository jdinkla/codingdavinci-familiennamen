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
        assert.deepEqual(ys, [1431, 1500, 1600, 1700, 1800]);
    });

    it('getYears(1431, 1851)', function() {
        var ys = utils.getYears(1431, 1851);
        assert.deepEqual(ys, [1431, 1500, 1600, 1700, 1800, 1851]);
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

});


