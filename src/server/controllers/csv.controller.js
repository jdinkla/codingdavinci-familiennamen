/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

export const index = (req, res) => {
    res.render('data/index', { title: 'Die Daten' });
};

export const konfession = (req, res) => {
    res.render('data/konfession', { title: 'konfession.csv' });
};

export const staat = (req, res) => {
    res.render('data/staat', { title: 'staat.csv' });
};

export const territorium = (req, res) => {
    res.render('data/territorium', { title: 'territorium.csv' });
};

export const foko = (req, res) => {
    res.render('data/foko', { title: 'foko.csv' });
};

export default {
    index,
    konfession,
    staat,
    territorium,
    foko
};

