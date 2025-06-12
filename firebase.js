// firebase.js
const admin = require('firebase-admin');

let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  if (!process.env.FIREBASE_CONFIG_JSON) {
    throw new Error('FIREBASE_CONFIG_JSON 環境變數未設定！');
  }
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
} else {
  serviceAccount = require('./firebaseKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
