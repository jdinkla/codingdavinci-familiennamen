/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var assert = require('assert');
var name = require('../app_api/controllers/timeline');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var _ = require('underscore');

chai.use(chaiHttp);

describe('map', function() {

    it('müller', function (done) {
        chai.request(server)
            .get('/api/map/müller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.every( x => x.familyName.should.be.eql("müller") );
                done();
            });
    });

    it('mueller', function (done) {
        chai.request(server)
            .get('/api/map/mueller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.every( x => x.familyName.should.be.eql("mueller") );
                done();
            });
    });

    it('muller', function (done) {
        chai.request(server)
            .get('/api/map/muller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.every( x => x.familyName.should.be.eql("muller") );
                done();
            });
    });

    it('müller, mueller', function (done) {
        chai.request(server)
            .get('/api/map/müller,mueller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.every( x => x.familyName.should.be.oneOf("müller", "mueller") );
                done();
            });
    });

});
