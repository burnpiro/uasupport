const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.dbtriggers = require('./dbTriggers');
exports.roles = require('./claimManagement');
exports.members = require('./members');

// exports.bundleAids = functions.https.onRequest(async (req, res) => {
//   functions.logger.info('Hello logs!', { structuredData: true });
//
//   const bundleId = 'latest-aids';
//
//   const bundle = admin.firestore().bundle(bundleId);
//   var querySnapshot = await admin.firestore().collection('aids').get();
//
//   var bundleBuffer = bundle
//     .add('latest-aids-query', querySnapshot) // Add a named query.
//     .build();
//
//   await bucket.file('aids-data').save(bundleBuffer);
//   // Grab the text parameter.
//   const date = new Date().toString();
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await admin.firestore().collection('messages').add({ original: date });
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Bundle with ID: ${bundleId} added.` });
// });