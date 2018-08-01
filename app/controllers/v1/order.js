var orderService = require('../../services/order');

exports.index = async (req, res)=>{
    try {
        var response = await orderService.index(req.params.customerId, req.query);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
