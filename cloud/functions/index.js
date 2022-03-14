const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.dbtriggers = require('./dbTriggers');
exports.roles = require('./claimManagement');
exports.members = require('./members');
// exports.migrations = require('./migrations');
