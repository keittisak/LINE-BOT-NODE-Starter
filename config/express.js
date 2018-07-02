module.exports = function(){
    const express = require('express');
    
    // create Express app
    // about Express itself: https://expressjs.com/
    const app = express();

    // Set up the routing.
    const v1 = express.Router();
    // const v2 = express.Router();

    require('../app/routes/v1/index')(v1);
    require('../app/routes/v1/line')(v1);
    // require('../app/routes/v1/facebook')(v1);

    app.use('/api/v1', v1);
    app.use('/', v1);

    return app;
};