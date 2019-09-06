
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  db = firebase.firestore();
  user
  uid
  public userProfile: firebase.firestore.DocumentReference;
  constructor() {
  
  }
  
  loginUser(email: string,password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUserCredential: firebase.auth.UserCredential) => {
this.uid = firebase.auth().currentUser.uid
firebase.firestore().collection('salonAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').add({numberofbookings:0,numberofclicks:0,likes:0}).then(val=>{
  console.log(val)
})


        firebase.firestore().doc(`/SalonOwnerProfile/${newUserCredential.user.uid}`).set({ email  });
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
setUser(val){
  this.user = val;
    console.log('User form Provider', this.user);
}
getUser(){
  return this.user;
}
}
