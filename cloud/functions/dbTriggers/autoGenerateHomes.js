const functions = require('firebase-functions');
const admin = require('firebase-admin');

const bucket = admin.storage().bucket();
exports.autoGenerateHomes = functions.firestore
  .document('homes/{docId}')
  .onWrite(async (change, context) => {
    const bundleId = 'latest-homes';

    const bundle = admin.firestore().bundle(bundleId);
    var querySnapshot = await admin
      .firestore()
      .collection('homes')
      .where('hidden', '!=', true)
      .get();

    var bundleBuffer = bundle
      .add('latest-homes-query', querySnapshot) // Add a named query.
      .build();

    await bucket.file('homes-data').save(bundleBuffer);
  });
