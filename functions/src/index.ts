const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();


const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


export const welcomeEmail = functions.auth.user().onCreate ( (user : any) =>{
  
            // const msg = {
            //     // to: user.email,
            //     // from: 'hello@angularfirebase.com',
            //     // subject:  'New Follower',
        
            //     // templateId: 'd-f7bdfb34e2ec4921b679469f125b77ea',
              
            //     // dynamic_template_data: {
            //     //         subject: 'Welcome to my awesome app',
            //     //         name: user.ownername
            //     // }
                
            // };
            // return sgMail.send()
        console.log('welcome user')


});

// exports.firestoreEmail = functions.firestore
//     .document('users/{userId}/followers/{followerId}')
//     .onCreate(event => {

//         const userId = event.params.userId;

//         const db = admin.firestore()

//         return db.collection('users').doc(userId)
//                  .get()
//                  .then(doc => {

//                     const user = doc.data()

//                     const msg = {
//                         to: user.email,
//                         from: 'hello@angularfirebase.com',
//                         subject:  'New Follower',
//                         // text: `Hey ${toName}. You have a new follower!!! `,
//                         // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,
            
//                         // custom templates
//                         templateId: 'your-template-id-1234',
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
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
