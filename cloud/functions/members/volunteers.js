const functions = require('firebase-functions');
const admin = require('firebase-admin');
const types = require('../configs/types');

const { MANAGER_TYPE, ORGANIZATIONS_COL, VOLUNTEERS_COL, VOLUNTEER_TYPE } = types;

exports.addVolunteerToOrg = functions.https.onCall(async (data, context) => {
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
    if (currUserToken.admin !== true && orgData.roles[currUserId] !== MANAGER_TYPE) {
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

    // Add selected user to Org as volunteer
    await orgRef.update({
      ...orgData,
      roles: { ...orgData.roles, [user.uid]: VOLUNTEER_TYPE }
    });

    // Add selected user to Org as volunteer
    const collectionRef = admin.firestore().collection(VOLUNTEERS_COL);
    await collectionRef.add({
      ...member,
      roles: {
        [currUserId]: 'owner'
      },
      organization: organizationId,
      createdAt: new Date()
    });



    // Add volunteer role to selected account
    await admin.auth().setCustomUserClaims(
      user.uid,
      user.customClaims != null
        ? { ...user.customClaims, [VOLUNTEER_TYPE]: true }
        : {
          [VOLUNTEER_TYPE]: true
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



exports.removeVolunteerFromOrg = functions.https.onCall(async (data, context) => {
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
    if (currUserToken.admin !== true && orgData.roles[currUserId] !== MANAGER_TYPE) {
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

    // remove selected user from Org
    const newRoles = {
      ...orgData.roles
    };
    delete newRoles[user.uid];
    await orgRef.update({
      ...orgData,
      roles: newRoles
    });

    // Remove volunteer from volunteers collection (by org)
    const collection = await admin
      .firestore()
      .collection(VOLUNTEERS_COL)
      .where('organization', '==', organizationId)
      .where('email', '==', member.email)
      .get();

    collection.forEach((el) => {
      el.ref.delete();
    });

    // Check if there is any other volunteer assignment for this user
    const anyVolunteerAccountLeft = await admin
      .firestore()
      .collection(VOLUNTEERS_COL)
      .where('email', '==', member.email)
      .get();

    // Remove volunteer role from selected account is no existing volunteer assignments
    if (anyVolunteerAccountLeft.size < 1) {
      const newClaims = { ...user.customClaims };
      delete newClaims[VOLUNTEER_TYPE];
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
