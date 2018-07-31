/* eslint-disable */
var axios = require('axios');

module.exports = function () {
    return axios.create({
        baseURL: 'https://admin.movefast.me/api',
        // baseURL: 'http://admin.movefast.loc/api',
        // timeout: 1000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}
