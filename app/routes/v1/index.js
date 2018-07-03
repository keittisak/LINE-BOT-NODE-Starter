module.exports = (app)=>{
    const index = require('../../controllers/v1/index');
    app.get('/', index.index);
}