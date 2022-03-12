const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  try {
    const currUserToken = context.auth.token;
    if (currUserToken.admin !== true) {
      return {
        status: 403
      };
    }
    const user = await admin.auth().getUserByEmail(data.email);
    if (user == null) {
      return {
        status: 404
      };
    }
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
    return {
      status: 200
    };
  } catch (e) {
    return e;
  }
});

// USE ON LOCAL ENV ONLY
// exports.addAdminRoleOriginal = functions.https.onRequest(async (req, res) => {
//
//   const user = await admin.auth().getUserByEmail('raccoon.peach.28@example.com');
//   await admin.auth().setCustomUserClaims(user.uid, {
//     admin: true
//   });
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Completed` });
// });
