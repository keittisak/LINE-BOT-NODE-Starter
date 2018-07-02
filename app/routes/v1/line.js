module.exports = function(app){
    const line = require('../../../config/line');
    const lines = require('../../controllers/v1/line');
    app.post('/lines/callback', line.middleware, lines.callback);
}