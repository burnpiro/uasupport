const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bucket = admin.storage().bucket();

exports.autoGenerateFundraising = functions.firestore
  .document('fundraising/{docId}')
  .onWrite(async (change, context) => {
    const bundleId = 'latest-fundraising';

    const bundle = admin.firestore().bundle(bundleId);
    var querySnapshot = await admin.firestore().collection('fundraising').get();

    var bundleBuffer = bundle
      .add('latest-fundraising-query', querySnapshot) // Add a named query.
      .build();

    await bucket.file('fundraising-data').save(bundleBuffer);
  });