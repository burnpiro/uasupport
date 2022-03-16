const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bucket = admin.storage().bucket();

exports.autoGenerateGroups = functions.firestore
  .document('groups/{docId}')
  .onWrite(async (change, context) => {
    const bundleId = 'latest-groups';

    const bundle = admin.firestore().bundle(bundleId);
    var querySnapshot = await admin
      .firestore()
      .collection('groups')
      .where('hidden', '!=', true)
      .get();

    var bundleBuffer = bundle
      .add('latest-groups-query', querySnapshot) // Add a named query.
      .build();

    await bucket.file('groups-data').save(bundleBuffer);
  });
