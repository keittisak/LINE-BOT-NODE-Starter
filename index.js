const express = require('./config/express');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port);
module.exports = app;
console.log('listening on ' + port);