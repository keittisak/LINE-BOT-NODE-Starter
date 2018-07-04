const line = require('../../../config/line');
const firebase = require('../../../config/firebase');
const uuidv4 = require('uuid/v4');
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
    var currentUser = 'DBvYKBUok0GKUob3vxjo';
    var senderUser = '';
    var userRef = db.collection('users');
    var conversationRef = db.collection('conversations');
    return userRef
        //check user exist
        .where('id', '==', data.source.userId)
        .where('channel', '==', 'line')
        .get()
        .then(snapshot => {
            if (snapshot.size === 0) {
                //create new user
                var _data = {
                    channel: 'line',
                    id: data.source.userId
                };
                return userRef
                    .add(_data)
                    .then(ref => {
                        // console.log(ref)
                        //update profile
                        line.client.getProfile(data.source.userId).then((profile)=>{ 
                            console.log(profile)
                            console.log(ref.id)
                            userRef.doc(ref.id).update({
                                displayName: profile.displayName,
                                pictureUrl: profile.pictureUrl
                            })
                        })            
                        return {"id": ref.id, "data": data};
                    })
                    .catch(err => {
                        console.log('Error add user', err);
                    });
            }else{
                var userIds = [];
                var userDatas = [];
                snapshot.forEach(doc => {
                    userIds.push(doc.id);
                    userDatas.push(doc.data());
                });
                return {"id": userIds[0], "data": userDatas[0]};
            }
        })
        .then(user => {
            //console.log(user);
            senderUser = user.id;
            //get message
            conversationUsers = [currentUser, senderUser];
            return conversationRef
                .where('users', '==', conversationUsers)
                .get()
                .then(snapshot => {
                    if (snapshot.size === 0) {
                        var _data = {
                            created: Date.now(),
                            users: [currentUser, ref.id],
                            messages: []
                        }
                        //create new conversation
                        return conversationRef.add(_data)
                            .then(ref => { 
                                // console.log(ref)
                                return {"id": ref.id, "data": data};
                            })
                    }else{
                        var conversationIds = [];
                        var conversationDatas = [];
                        snapshot.forEach(doc => {
                            conversationIds.push(doc.id);
                            conversationDatas.push(doc.data());
                        });
                        return {"id": conversationIds[0], "data": conversationDatas[0]};
                    }
                })
                .catch(err => {
                    console.log('Error getting conversation', err);
                });
        })
        .then(conversation => {
            //console.log(conversation);
            var _data = {
                created: Date.now(),
                id: uuidv4(),
                text: data.message.text, 
                sender: senderUser
            }
            return conversationRef.doc(conversation.id).update({
                messages: [...conversation.data.messages, _data]
            })
            .then((writeResult) => {
                console.log("Process event success")
                // return;
            })
            .catch(err => {
                console.log('Error update conversation', err);
            });
        })
        .catch(err => {
            console.log('Error in process', err);
        });

    // // create a echoing text message
    // const echo = { type: 'text', text: data.message.text };
  
    // // use reply API
    // return line.client.replyMessage(data.replyToken, echo);
}

// event handler
function sendMessageHandleEvent(data) {
    console.log(data.userId);
    console.log(data.type);
    console.log(data.msg);

    // use push API
    return line.client.pushMessage(data.userId, { type: data.type, text: data.msg });
}
