module.exports = ()=>{
    const express = require('express');
    const bodyParser = require('body-parser');
    const line = require('./line');
    
    // create Express app
    // about Express itself: https://expressjs.com/
    const app = express();

    // Set up the routing.
    const v1 = express.Router();
    // const v2 = express.Router();

    app.use('/lines/recieve', line.middleware)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended:true
    }))

    require('../app/routes/v1/index')(v1);
    require('../app/routes/v1/line')(v1);
    // require('../app/routes/v1/facebook')(v1);

    app.use('/api/v1', v1);
    // app.use('/', v1);

    app.use('/', express.static('public'))

    return app;
};