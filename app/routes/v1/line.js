module.exports = (app)=>{
    const line = require('../../../config/line');
    const lines = require('../../controllers/v1/line');
    app.post('/lines/recieve', line.middleware, lines.recieve);
    app.post('/lines/send', line.middleware, lines.send);
}