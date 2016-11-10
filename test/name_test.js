/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var assert = require('assert');
var name = require('../app_api/controllers/name');
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
        chai.request(server)
            .get('/api/name/d')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('exact patttern not in db', function (done) {
        chai.request(server)
            .get('/api/name/thisnameisnotinthedb')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('exact patttern müller', function (done) {
        chai.request(server)
            .get('/api/name/müller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('müller');
                done();
            });
    });

    it('exact patttern mueller', function (done) {
        chai.request(server)
            .get('/api/name/mueller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('mueller');
                done();
            });
    });

    it('exact patttern muller', function (done) {
        chai.request(server)
            .get('/api/name/muller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('muller');
                done();
            });
    });

    it('like patttern müller', function (done) {
        chai.request(server)
            .get('/api/name/like/müller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('müller');
                done();
            });
    });

    it('like patttern mueller', function (done) {
        chai.request(server)
            .get('/api/name/like/mueller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('mueller');
                done();
            });
    });

    it('like patttern muller', function (done) {
        chai.request(server)
            .get('/api/name/like/muller')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('muller');
                done();
            });
    });

    it('regexp patttern müller', function (done) {
        chai.request(server)
            .get('/api/name/regexp/%5Em%C3%BCller%24')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('müller');
                done();
            });
    });

    it('regexp patttern mueller', function (done) {
        chai.request(server)
            .get('/api/name/regexp/%5Emueller%24')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('mueller');
                done();
            });
    });

    it('regexp patttern muller', function (done) {
        chai.request(server)
            .get('/api/name/regexp/%5Emuller%24')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.eql('muller');
                done();
            });
    });

});
