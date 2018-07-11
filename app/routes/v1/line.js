module.exports = (app)=>{
    const lines = require('../../controllers/v1/line');
    app.post('/lines/:id/recieve', lines.recieve);
    app.post('/lines/:id/send', lines.send);
}