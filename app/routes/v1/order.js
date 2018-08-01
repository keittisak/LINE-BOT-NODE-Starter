module.exports = (app)=>{
    const orders = require('../../controllers/v1/order');
    app.get('/customers/:customerId/orders', orders.index);
}