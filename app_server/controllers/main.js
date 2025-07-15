/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

export const admin = (req, res) => {
    res.render('admin/index', { title: 'Administration' });
};

export const analysis = (req, res) => {
    res.render('analysis',
        { title: 'Namen-Explorer', ngApp: 'FamVis', ngController: 'explorerController'});
};

export const docs = (req, res) => {
    res.render('docs/index', { title: 'Dokumentation' });
};

export const index = (req, res) => {
    res.render('index', { title: 'Verbreitung von Familennamen' });
};

export const imprint = (req, res) => {
    res.render('imprint', { title: 'Impressum' });
};

export const visualization = (req, res) => {
    res.render('visualization',
        { title: 'Visualisierung', ngApp: 'FamVis', ngController: 'explorerController' });
};

export default {
    index,
    analysis,
    docs,
    visualization,
    imprint,
    admin
};
