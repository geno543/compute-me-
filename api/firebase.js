const admin = require('firebase-admin');

const serviceAccountString = process.env.FIREBASECONFIGS;
if (!serviceAccountString) {
  throw new Error('FIREBASECONFIGS environment variable is not set');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountString);
} catch (error) {
  throw new Error('Error parsing FIREBASECONFIGS environment variable: ' + error.message);
}

if (!serviceAccount.project_id) {
  throw new Error('Service account object must contain a string "project_id" property.');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'aura-hunt.appspot.com' // Replace with your Firebase Storage bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };

