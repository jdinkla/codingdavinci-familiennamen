/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

module.exports.index = function(req, res){
    res.render('data/index', { title: 'Die Daten' });
};

module.exports.konfession = function(req, res){
    res.render('data/konfession', { title: 'konfession.csv' });
};

module.exports.staat = function(req, res){
    res.render('data/staat', { title: 'staat.csv' });
};

module.exports.territorium = function(req, res){
    res.render('data/territorium', { title: 'territorium.csv' });
};

module.exports.foko = function(req, res){
    res.render('data/foko', { title: 'foko.csv' });
};
