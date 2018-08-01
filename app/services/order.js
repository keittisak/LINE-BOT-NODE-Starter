var Api = require('./api');

exports.index = function(customerId, option) {
    return Api().get('/customers/' + customerId + '/orders', {params: option}) 
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

