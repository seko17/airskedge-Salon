const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');

admin.initializeApp(functions.config());

const SENDGRID_API_KEY = functions.config().sendgrid.key;


sgMail.setApiKey(SENDGRID_API_KEY);
// exports.firestoreEmail = functions.firestore
//     .document('SalonOwnerProfile/{userId}/').onCreate( event,content => {

//         const userId = event.params.userId;

//         const db = admin.firestore()

//         return db.collection('SalonOwnerProfile').doc(userId).get().then( doc => {

//                     const user = doc.data()

//                     const msg = {
//                         to: user.email,
//                         from: 'hello@angularfirebase.com',
//                         subject:  'New Follower',
//                         // text: `Hey ${toName}. You have a new follower!!! `,
//                         // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,
            
//                         // custom templates
//                         templateId: '430396ec-411d-4b9d-b26a-b8bfd82bc227',
//                         substitutionWrappers: ['{{', '}}'],
//                         substitutions: {
//                           name: user.displayName
//                           // and other custom properties here
//                         }
//                     };

//                     return sgMail.send(msg)
//                 })
//                 .then(() => console.log('email sent!') )
//                 .catch(err => console.log(err) )
                     

// });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
