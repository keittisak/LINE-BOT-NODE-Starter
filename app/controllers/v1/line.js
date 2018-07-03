const line = require('../../../config/line');
const firebase = require('../../../config/firebase');
const db = firebase.firestore;

exports.recieve = (req, res)=>{
    console.log(req.body.events);
    // recieve message from line and save to firestore
    Promise
        .all(req.body.events.map(recieveMessageHandleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
    });
};

exports.send = (req, res)=>{
    console.log(req.body);
    data = [req.body];
    // recieve message from app and send to line
    Promise
        .all(data.map(sendMessageHandleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
    });
}

// event handler
function recieveMessageHandleEvent(data) {
    if (data.type !== 'message' || data.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }
    
    //save data to firestore
    var userRef = db.collection('users');

    var data = {
        channel: 'line',
        id: event.source.userId
    };
    return userRef.add(data);


    // // create a echoing text message
    // const echo = { type: 'text', text: data.message.text };
  
    // // use reply API
    // return line.client.replyMessage(data.replyToken, echo);
}

// event handler
function sendMessageHandleEvent(data) {
    // console.log(data.userId);
    // console.log(data.type);
    // console.log(data.msg);

    // use push API
    return line.client.pushMessage(data.userId, { type: data.type, text: data.msg });
}
