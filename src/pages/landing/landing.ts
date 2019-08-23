import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SalonRegistrationpagePage } from '../salon-registrationpage/salon-registrationpage';
import { BookingsPage } from '../bookings/bookings';


/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {
  db = firebase.firestore();
  uid
  profile = false;
  displayProfile
  SalonOwnerProfile = {
    ownerImage: '',
    ownername: '',
    ownerSurname: '',
    personalNumber: '',
    About: '',
    uid: ''

  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authservice : AuthServiceProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,) {

      this.uid = firebase.auth().currentUser.uid;
      this.authservice.setUser(this.uid);
  }

  ionViewDidLoad() {
   this.getProfile();
  }
  logout(){
    this.authservice.logoutUser().then(() =>{
      this.navCtrl.setRoot(LoginPage);
    });
  }
  bookings(){
    this.navCtrl.push(BookingsPage)
  }

  manageSalon(){
    this.navCtrl.push(ManageHairSalonPage)
  }
  getProfile(){
    // load the process
    let load = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of users...
    let users = this.db.collection('SalonOwnerProfile');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.authservice.getUser());
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this.SalonOwnerProfile.About = doc.data().About;
          this.SalonOwnerProfile.ownerImage = doc.data().ownerImage;
          this.SalonOwnerProfile.ownerSurname = doc.data().ownerSurname;
          this.SalonOwnerProfile.ownername = doc.data().ownername;
          this.SalonOwnerProfile.personalNumber = doc.data().personalNumber;
        this.profile = true;
        })
       
      } else {
        console.log('No data');
      this.profile = false;
      }
      // dismiss the loading
      load.dismiss();
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
      // dismiss the loading
      load.dismiss();
    })
  }
  createAccount(){
    this.navCtrl.setRoot(SalonRegistrationpagePage)
  }
}
