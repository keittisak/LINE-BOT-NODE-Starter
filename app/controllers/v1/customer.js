var customerService = require('../../services/customer');

exports.index = async (req, res)=>{
    try {
        var response = await customerService.index(req.query);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
exports.show = async (req, res)=>{
    try {
        var response = await customerService.show(req.params.id);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
exports.store = async (req, res)=>{
    try {
        var response = await customerService.store(req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
exports.update = async (req, res)=>{
    try {
        var response = await customerService.update(req.params.id, req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
