/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var assert = require('assert');
var name = require('../app_api/controllers/name');
var utils = require('../public/javascripts/browser_utils');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('name', function() {

    it('exact patttern undefined', function (done) {
        chai.request(server)
            .get('/api/name/')
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });

    it('exact patttern in db', function (done) {
        var enc = utils.encode('d');
        chai.request(server)
            .get('/api/name/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('exact patttern not in db', function (done) {
        var enc = utils.encode('thisnameisnotinthedb');
        chai.request(server)
            .get('/api/name/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('exact patttern müller', function (done) {
        var enc = utils.encode('müller');
        chai.request(server)
            .get('/api/name/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('müller');
                done();
            });
    });

    it('exact patttern mueller', function (done) {
        var enc = utils.encode('mueller');
        chai.request(server)
            .get('/api/name/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('mueller');
                done();
            });
    });

    it('exact patttern muller', function (done) {
        var enc = utils.encode('muller');
        chai.request(server)
            .get('/api/name/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('muller');
                done();
            });
    });

    it('like patttern müller', function (done) {
        var enc = utils.encode('müller');
        chai.request(server)
            .get('/api/name/like/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('müller');
                done();
            });
    });

    it('like patttern mueller', function (done) {
        var enc = utils.encode('mueller');
        chai.request(server)
            .get('/api/name/like/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('mueller');
                done();
            });
    });

    it('like patttern muller', function (done) {
        var enc = utils.encode('muller');
        chai.request(server)
            .get('/api/name/like/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('muller');
                done();
            });
    });

    it('regexp patttern müller', function (done) {
        var enc = utils.encode('^müller$');
        chai.request(server)
            .get('/api/name/regexp/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('müller');
                done();
            });
    });

    it('regexp patttern mueller', function (done) {
        var enc = utils.encode('^mueller$');
        chai.request(server)
            .get('/api/name/regexp/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('mueller');
                done();
            });
    });

    it('regexp patttern muller', function (done) {
        var enc = utils.encode('^muller$');
        chai.request(server)
            .get('/api/name/regexp/' + enc)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body[0].should.be.eql('muller');
                done();
            });
    });

});
