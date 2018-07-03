
module.exports = ()=>{
    const admin = require('firebase-admin');

    var serviceAccount = require('../key/chat-b4e9e-6c3d79e906a9.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    return admin.firestore();
};