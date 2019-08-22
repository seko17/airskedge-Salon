import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AddSalonPage } from '../add-salon/add-salon';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
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
 
   let load = this.loadingCtrl.create({
    content: 'Please wait...',
    spinner: 'dots'
  });
  load.present();
  
  let users = this.db.collection('SalonNode');
  
  let query = users.where("userUID", "==", this.authService.getUser());
  query.get().then( snap => {
    
    if (snap.empty !== true){
      console.log('Got data', snap);
      snap.forEach(doc => {
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
   
    load.dismiss();
  }).catch(err => {
   
    console.log("Query Results: ", err);
  
    load.dismiss();
  })
}

ViewUserPorfilePage(){
  this.navCtrl.push(ViewUserPorfilePage);
}
addStyle(){
  this.navCtrl.push(AddhairStylePage)
}
}
