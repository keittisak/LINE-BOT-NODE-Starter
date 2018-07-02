const line = require('../../../config/line');
const Promises = require('es6-promise').Promise;

exports.callback = function(req, res){
    // register a webhook handler with middleware
    // about the middleware, please refer to doc
    console.log(req.body.events);
    Promises
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
    });
};

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }
  
    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };
  
    // use reply API
    return line.client.replyMessage(event.replyToken, echo);
}
