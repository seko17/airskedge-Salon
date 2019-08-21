import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AddSalonPage } from '../add-salon/add-salon';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
/**
 * Generated class for the ManageHairSalonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-hair-salon',
  templateUrl: 'manage-hair-salon.html',
})
export class ManageHairSalonPage {
  isSalon = false;
  db = firebase.firestore();
  uid
  displayProfile
  SalonNode = {
    salonName: '',
    salonImage: '',
    salonLogo: '',
    location: '',
    numHairDressers: '',
    SalonDesc: '',
    SalonContactNo: '',
    userUID: ''


  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,) {

      this.uid = firebase.auth().currentUser.uid;
    this.authService.setUser(this.uid);
  }

  ionViewDidLoad() {
    this.getHairSalon();
    console.log('check salon profile',this.displayProfile);
    
  }
addSalon(){
  this.navCtrl.push(AddSalonPage)
}

getHairSalon(){
   // load the process
   let load = this.loadingCtrl.create({
    content: 'Just a sec...',
    spinner: 'bubbles'
  });
  load.present();
  // create a reference to the collection of users...
  let users = this.db.collection('SalonNode');
  // ...query the profile that contains the uid of the currently logged in user...
  let query = users.where("userUID", "==", this.authService.getUser());
  query.get().then(querySnapshot => {
    // ...log the results of the document exists...
    if (querySnapshot.empty !== true){
      console.log('Got data', querySnapshot);
      querySnapshot.forEach(doc => {
        console.log('Profile Document: ', doc.data())
        this.displayProfile = doc.data();
        this.SalonNode.salonName  = doc.data().salonName;
        this.SalonNode.salonLogo  = doc.data().salonLogo;
        this.SalonNode.salonImage  = doc.data().salonImage;
        this.SalonNode.numHairDressers  = doc.data().numHairDressers;
        this.SalonNode.location  = doc.data().location;
        this.SalonNode.SalonDesc  = doc.data().SalonDesc;
        this.SalonNode.SalonContactNo  = doc.data().SalonContactNo;
   
      })
      this.isSalon = true;
    } else {
      console.log('No data');
      this.isSalon = false;
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

ViewUserPorfilePage(){
  this.navCtrl.push(ViewUserPorfilePage);
}
}
