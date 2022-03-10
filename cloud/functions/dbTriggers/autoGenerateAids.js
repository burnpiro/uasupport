const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bucket = admin.storage().bucket();

exports.autoGenerateAids = functions.firestore
  .document('aids/{docId}')
  .onWrite(async (change, context) => {
    const bundleId = 'latest-aids';

    const bundle = admin.firestore().bundle(bundleId);
    var querySnapshot = await admin.firestore().collection('aids').get();

    var bundleBuffer = bundle
      .add('latest-aids-query', querySnapshot) // Add a named query.
      .build();

    await bucket.file('aids-data').save(bundleBuffer);
  });