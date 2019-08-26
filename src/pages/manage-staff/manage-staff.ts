import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
import { AddStaffPage } from '../add-staff/add-staff';
/**
 * Generated class for the ManageStaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-staff',
  templateUrl: 'manage-staff.html',
})
export class ManageStaffPage {
  db = firebase.firestore();
  displayProfile: firebase.firestore.DocumentData;
  staff = [];
  isStaff = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private formBuilder: FormBuilder) {

  }

  ionViewDidLoad() {
    this.Staff();
    console.log('hahaha',this.staff)
  }
 //function to add person
 addperson(){
   this.navCtrl.push(AddStaffPage)
 }
  Staff(){
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   let users = this.db.collection('SalonNode');
   let query = users.where("userUID", "==", this.authUser.getUser());
   query.get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
         this.displayProfile = doc.data();
 //query to get all staff
         this.db.collection('SalonNode').doc(doc.data().salonName).collection('Staff').get().then( res =>{
       res.forEach(doc =>{
 this.staff.push(doc.data());
         console.log('styles' , doc.data());
         this.isStaff = true;
       })
       });
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
}