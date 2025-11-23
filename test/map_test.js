/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var assert = require('assert');
var utils = require('../public/javascripts/browser_utils');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var _ = require('underscore');

chai.use(chaiHttp);

describe('map', function() {

    it('müller', function (done) {
        var enc = utils.encode('müller');
        chai.request(server)
            .get('/api/map/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.every( x => x.familyName.should.be.eql("müller") );
                done();
            });
    });

    it('mueller', function (done) {
        var enc = utils.encode('mueller');
        chai.request(server)
            .get('/api/map/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.every( x => x.familyName.should.be.eql("mueller") );
                done();
            });
    });

    it('muller', function (done) {
        var enc = utils.encode('muller');
        chai.request(server)
            .get('/api/map/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.every( x => x.familyName.should.be.eql("muller") );
                done();
            });
    });

    it('müller, mueller', function (done) {
        var enc = utils.encodeListOfNames(['müller', 'mueller']);
        chai.request(server)
            .get('/api/map/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.every( x => x.familyName.should.be.oneOf(["müller", "mueller"]) );
                done();
            });
    });

});
