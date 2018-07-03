module.exports = (app)=>{
    const lines = require('../../controllers/v1/line');
    app.post('/lines/recieve', lines.recieve);
    app.post('/lines/send', lines.send);
}