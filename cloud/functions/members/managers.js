const functions = require('firebase-functions');
const admin = require('firebase-admin');
const types = require('../configs/types');

const { MANAGER_TYPE, ORGANIZATIONS_COL, MANAGERS_COL } = types;

exports.addManagerToOrg = functions.https.onCall(async (data, context) => {
  try {
    const currUserToken = context.auth.token;
    const currUserId = context.auth.uid;
    const { organizationId, member } = data;
    const orgRef = admin.firestore().doc(`${ORGANIZATIONS_COL}/${organizationId}`);

    // Get organization by UID
    let organizationData = await orgRef.get();
    if (!organizationData.exists) {
      return {
        status: 404
      };
    }
    let orgData = organizationData.data();

    //Check if curr user has "manager" role in organization or if it's admin
    if (currUserToken.admin !== true) {
      return {
        status: 403
      };
    }

    // Get Volunteer's user account by email
    const user = await admin.auth().getUserByEmail(member.email);
    if (user == null) {
      return {
        status: 404
      };
    }

    // Add selected user to Org as manager
    await orgRef.update({
      ...orgData,
      roles: { ...orgData.roles, [user.uid]: MANAGER_TYPE }
    });

    // Add Manager to managers collection
    const collectionRef = admin.firestore().collection(MANAGERS_COL);
    await collectionRef.add({
      ...member,
      roles: {
        [currUserId]: 'owner'
      },
      organization: organizationId,
      createdAt: new Date()
    });

    // Add manager role to selected account
    await admin.auth().setCustomUserClaims(
      user.uid,
      user.customClaims != null
        ? { ...user.customClaims, [MANAGER_TYPE]: true }
        : {
            [MANAGER_TYPE]: true
          }
    );

    return {
      status: 200
    };
  } catch (e) {
    console.error(e);
    return e;
  }
});

exports.removeManagerFromOrg = functions.https.onCall(async (data, context) => {
  try {
    const currUserToken = context.auth.token;
    const currUserId = context.auth.uid;
    const { organizationId, member } = data;
    const orgRef = admin.firestore().doc(`${ORGANIZATIONS_COL}/${organizationId}`);

    // Get organization by UID
    let organizationData = await orgRef.get();
    if (!organizationData.exists) {
      return {
        status: 404
      };
    }
    let orgData = organizationData.data();

    //Check if curr user is admin
    if (currUserToken.admin !== true) {
      return {
        status: 403
      };
    }

    // Get Volunteer's user account by email
    const user = await admin.auth().getUserByEmail(member.email);
    if (user == null) {
      return {
        status: 404
      };
    }

    // Remove selected user from Org
    const newRoles = {
      ...orgData.roles
    };
    delete newRoles[user.uid];
    await orgRef.update({
      ...orgData,
      roles: newRoles
    });

    // Remove Manager from managers collection (by org
    const collection = await admin
      .firestore()
      .collection(MANAGERS_COL)
      .where('organization', '==', organizationId)
      .where('email', '==', member.email)
      .get();

    collection.forEach((el) => {
      el.ref.delete();
    });

    // Check if there is any other manager assignment for this user
    const anyManagerAccountLeft = await admin
      .firestore()
      .collection(MANAGERS_COL)
      .where('email', '==', member.email)
      .get();

    // Remove manager role from selected account if no existing manager assignments
    if (anyManagerAccountLeft.size < 1) {
      const newClaims = { ...user.customClaims };
      delete newClaims[MANAGER_TYPE];
      await admin.auth().setCustomUserClaims(user.uid, newClaims);
    }

    return {
      status: 200
    };
  } catch (e) {
    console.error(e);
    return e;
  }
});
