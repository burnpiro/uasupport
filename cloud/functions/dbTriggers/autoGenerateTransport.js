const functions = require('firebase-functions');
const admin = require('firebase-admin');

const bucket = admin.storage().bucket();
exports.autoGenerateTransport = functions.firestore
  .document('transport/{docId}')
  .onWrite(async (change, context) => {
    const bundleId = 'latest-transport';

    const bundle = admin.firestore().bundle(bundleId);
    var querySnapshot = await admin
      .firestore()
      .collection('transport')
      .where('hidden', '!=', true)
      .get();

    var bundleBuffer = bundle
      .add('latest-transport-query', querySnapshot) // Add a named query.
      .build();

    await bucket.file('transport-data').save(bundleBuffer);
  });
