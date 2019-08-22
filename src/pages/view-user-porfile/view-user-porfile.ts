import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


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

  SalonOwnerProfile = {
    ownerImage: '',
    ownername: '',
    ownerSurname: '',
    personalNumber: '',
    About: '',
    uid: ''

  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
     public loadingCtrl: LoadingController, 
     public alertCtrl: AlertController,
     private authUser: AuthServiceProvider,) {

      
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
  }

  ionViewDidLoad() {
   this.getProfile()
  }


  getProfile(){
   
    let load = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });
    load.present();
    
    let users = this.db.collection('SalonOwnerProfile');

    let query = users.where("uid", "==", this.authUser.getUser());
    query.get().then(querySnapshot => {
    
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
        
        })
       
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
}
