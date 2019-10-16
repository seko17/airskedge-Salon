import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
import { AddStaffPage } from '../add-staff/add-staff';
import { LandingPage } from '../landing/landing';
import { ViewStaffProfilePage } from '../view-staff-profile/view-staff-profile';
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
  isnotStaff =false
  loaderAnimate = true
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

 
 view(value){
   this.navCtrl.push(ViewStaffProfilePage,value)
 }
  Staff(){
    this.loaderAnimate = true
   let users = this.db.collection('Salons');
   let query = users.where("userUID", "==", this.authUser.getUser());
   query.get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
         this.displayProfile = doc.data();
 //query to get all staff
         this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').onSnapshot( res =>{
       res.forEach(doc =>{
 this.staff.push(doc.data());
         console.log('styles' , doc.data());
         this.isStaff = true;
         this.isnotStaff = false
       })
       this.loaderAnimate = false
       });
       })   
     } else {
       console.log('No data'); 
     }
   
   }).catch(err => {
     console.log("Query Results: ", err);
   })
 }

 goback(){
  this.navCtrl.pop();
}

}
