const functions = require('firebase-functions');
const admin = require('firebase-admin');

//=====----------------------------------
// BEFORE_RUNNING IT MAKE SURE THAT BD TRIGGER IS DISABLED!!
//=====----------------------------------
exports.addHiddenKey = functions.https.onRequest(async (req, res) => {
  const homes = await admin.firestore().collection('homes').get();
  const transport = await admin.firestore().collection('transport').get();
  const aids = await admin.firestore().collection('aids').get();
  const batchArray = [];
  batchArray.push(admin.firestore().batch());
  let operationCounter = 0;
  let batchIndex = 0;

  homes.docs.forEach((docRef) => {
    batchArray[batchIndex].set(docRef.ref, { hidden: false }, { merge: true });
    operationCounter++;

    // There is a limit on how many queries can be in one batch
    if (operationCounter === 499) {
      batchArray.push(admin.firestore().batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  transport.docs.forEach((docRef) => {
    batchArray[batchIndex].set(docRef.ref, { hidden: false }, { merge: true });
    operationCounter++;

    // There is a limit on how many queries can be in one batch
    if (operationCounter === 499) {
      batchArray.push(admin.firestore().batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  aids.docs.forEach((docRef) => {
    batchArray[batchIndex].set(docRef.ref, { hidden: false }, { merge: true });
    operationCounter++;

    // There is a limit on how many queries can be in one batch
    if (operationCounter === 499) {
      batchArray.push(admin.firestore().batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  await batchArray.forEach(
    async (batch) => await batch.commit().catch((err) => console.error(err))
  );

  res.json({ result: `Completed` });
});
//=====----------------------------------
// BEFORE_RUNNING IT MAKE SURE THAT BD TRIGGER IS DISABLED!!
//=====----------------------------------
