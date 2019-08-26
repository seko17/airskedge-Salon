const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');

admin.initializeApp(functions.config());

const SENDGRID_API_KEY = functions.config().sendgrid.key;


sgMail.setApiKey(SENDGRID_API_KEY);
exports.firestoreEmail = functions.firestore.document('users/{userId}').onCreate( (event) => {
    const snapshot = event.data
    const user = snapshot.val()
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
