const line = require('@line/bot-sdk');
const firebase = require('./firebase');
const db = firebase.firestore;

module.exports = ()=>{
    // create LINE SDK config from env variables
    let clients = [];
    let middlewares = [];
    let configs = [];
    let channelRef = db.collection('channels');
    return new Promise((resolve, reject) => {
        channelRef
            .where('provider', '==', 'line')
            .get()
            .then(snapshot => {
                if (snapshot.size > 0) {
                    snapshot.forEach(doc => {
                        let config = {
                            id: doc.id,
                            channelId: doc.data().id,
                            channelAccessToken: doc.data().accessToken,
                            channelSecret: doc.data().secret
                        }
                        configs[config.channelId] = config;

                        let client = new line.Client(config);
                        clients[config.channelId] = client;

                        let middleware = line.middleware(config);
                        middlewares[config.channelId] = middleware;
                    });
                    resolve({"client": clients, "middleware": middlewares, "config": configs});
                }
            })   
    })
}
