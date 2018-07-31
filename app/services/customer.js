var Api = require('./api');

exports.index = function(option) {
    return Api().get('/customers', {params: option}) 
    .then(function (response) {
        // handle success
        console.log(response);
        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        return error;
    });
}
exports.show = function(id) {
    return Api().get('/customers/' + id) 
    .then(function (response) {
        // handle success
        console.log(response);
        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        return error;
    })
}
exports.store = function(data) {
    return Api().post('/customers/', data) 
    .then(function (response) {
        // handle success
        console.log(response);
        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        return error;
    })
}
exports.update = function(id, data) {
    return Api().put('/customers/' + id, data) 
    .then(function (response) {
        // handle success
        console.log(response);
        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        return error;
    })
}
