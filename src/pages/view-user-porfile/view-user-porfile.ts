import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { EditProfilePage } from '../edit-profile/edit-profile';


/**
 * Generated class for the ViewUserPorfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-user-porfile',
  templateUrl: 'view-user-porfile.html',
})
export class ViewUserPorfilePage {
  db = firebase.firestore();
  uid
  displayProfile
  profile = []
isProfile =false;
  SalonOwnerProfile = {
    ownerImage: '',
    ownername: '',
    ownerSurname: '',
    personalNumber: '',
    About: '',
    uid: '',
    email:''

  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
     public loadingCtrl: LoadingController, 
     public alertCtrl: AlertController,
     private authUser: AuthServiceProvider,
     private authservice : AuthServiceProvider,) {

      
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
  }

  ionViewDidLoad() {
   this.getProfile()
  }

  logout(){
    this.authservice.logoutUser().then(() =>{
      this.navCtrl.setRoot(LoginPage);
    });
  }


  getProfile(){
   
    let load = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });
    load.present();
    
    let users = this.db.collection('Users');

    let query = users.where("uid", "==", this.authUser.getUser());
    query.get().then(querySnapshot => {
    
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this.SalonOwnerProfile.About = doc.data().About;
          this.SalonOwnerProfile.ownerImage = doc.data().image;
          this.SalonOwnerProfile.ownerSurname = doc.data().surname;
          this.SalonOwnerProfile.ownername = doc.data().name;
          this.SalonOwnerProfile.personalNumber = doc.data().personalNumber;
          this.SalonOwnerProfile.email = doc.data().email;
        
        })
       this.isProfile = true;
      } else {
        console.log('No data');
      
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
  update(){
    this.navCtrl.push(EditProfilePage,this.SalonOwnerProfile)
  }
  goback(){
    this.navCtrl.pop()
  }
}
