/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

function admin(req, res){
    res.render('admin/index', { title: 'Administration' });
}

function analysis(req, res){
    res.render('analysis',
        { title: 'Namen-Explorer', ngApp: 'FamVis', ngController: 'explorerController'});
}

function docs(req, res){
    res.render('docs/index', { title: 'Dokumentation' });
}

function index(req, res){
    res.render('index', { title: 'Verbreitung von Familennamen' });
}

function imprint(req, res){
    res.render('imprint', { title: 'Impressum' });
}

function visualization(req, res){
    res.render('visualization',
        { title: 'Visualisierung', ngApp: 'FamVis', ngController: 'explorerController' });
}

module.exports = {
    index: index,
    analysis: analysis,
    docs: docs,
    visualization: visualization,
    imprint: imprint,
    admin: admin
};
