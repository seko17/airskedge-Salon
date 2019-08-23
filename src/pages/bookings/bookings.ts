import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
import * as firebase from 'firebase';
/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
db = firebase.firestore();
testArray = []
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,) {
  }

  ionViewDidLoad() {
    this.getHairSalon();
  }
  getHairSalon(){
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   
    
    this.db.collection('SalonNode').doc('Nakanjani').collection('staff').doc('busi').collection('2019-8-23').get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
         
         this.testArray.push(doc.data());
    
       })
   
     } else {
       console.log('No data');
     
     }
     load.dismiss();
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
     load.dismiss();
   })
 }
 
 
 //Function to push to the user profile page
 ViewUserPorfilePage(){
   this.navCtrl.push(ViewUserPorfilePage);
 }
 //Function to push to adding a new hairstyle
 addStyle(){
   this.navCtrl.push(AddhairStylePage)
 }
 
}
