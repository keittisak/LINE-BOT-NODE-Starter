var firebase = require('../../../config/firebase');
var db = firebase.firestore;
var line = {};
var lineId;

exports.recieve = (req, res)=>{
    //console.log(req.body.events);
    lineId = req.params.id;
    data = req.body.events;
    // recieve message from line and save to firestore
    Promise
        .all(data.map(recieveMessageHandleEvent))
        .then((result) => {res.json(result)})
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
};

exports.send = (req, res)=>{
    console.log(req.body);
    lineId = req.params.id;
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
async function recieveMessageHandleEvent(data) {
    line = await require('../../../config/line')();
    if (data.type !== 'message' || data.message.type !== 'text' || data.source.type !== 'user') {
        // system not support group
        // ignore non-text-message event
        return {success: 0};
    }

    //get profile from line
    var profile;
    try {
        profile = await line.client[lineId].getProfile(data.source.userId);
    } catch (error) {
        profile = {
            displayName: "",
            pictureUrl: ""
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////
    //find user
    var userId;
    var userRef = db.collection('users');
    var snapshot = await userRef.where('id', '==', data.source.userId).where('channelId', '==', line.config[lineId].id).limit(1).get();
    if (snapshot.size === 0) {
        //create new user
        var ref = await userRef.add({
            id: data.source.userId,
            channelId: line.config[lineId].id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        userId = ref.id;
        console.log('create new user success');
    }else{
        snapshot.forEach(doc => {
            userId = doc.id;
            return;
        });
        console.log('found exist user');
    }
    //update user profile
    var ref = await userRef.doc(userId).update({
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        updatedAt: Date.now()
    })
    ///////////////////////////////////////////////////////////////////////////////////////
    //find last conversation
    var conversationId;
    var conversationRef = db.collection('conversations');
    var snapshot = await conversationRef.where('userId', '==', userId).where('channelId', '==', line.config[lineId].id).limit(1).get();
    if (snapshot.size === 0) {
        //create new conversation
        var ref = await conversationRef.add({
            userId: userId,
            channelId: line.config[lineId].id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        conversationId = ref.id;
        console.log('create new conversation success');
    }else{
        snapshot.forEach(doc => {
            conversationId = doc.id;
            return;
        });
        console.log('found exist conversation');
    }

    //add new messages
    var messageId;
    var messageRef = db.collection('conversations').doc(conversationId).collection('messages');
     //create new message
    ref = await messageRef.add({
        senderId: userId,
        senderType: 'user',
        text: data.message.text,
        isRead: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    console.log('create new message success');
    return {success: 1};
}

// event handler
async function sendMessageHandleEvent(data) {
    line = await require('../../../config/line')();

    // use push API
    result = await line.client[lineId].pushMessage(data.userId, { type: data.type, text: data.msg });
    console.log('send message success');
    return {success: 1};
}
