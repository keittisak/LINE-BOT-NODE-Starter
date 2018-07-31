module.exports = (app)=>{
    const customers = require('../../controllers/v1/customer');
    app.get('/customers', customers.index);
    app.get('/customers/:id', customers.show);
    app.post('/customers', customers.store);
    app.put('/customers/:id', customers.update);
}