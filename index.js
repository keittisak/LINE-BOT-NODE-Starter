var express = require('./config/express');
var app = {};
var port = process.env.PORT || 3000;

async function main(){
    app = await express();
    app.listen(port);
    console.log('listening on ' + port);
}
main();



