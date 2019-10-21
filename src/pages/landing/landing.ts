import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Platform,App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SalonRegistrationpagePage } from '../salon-registrationpage/salon-registrationpage';
import { BookingsPage } from '../bookings/bookings';
import { UserCreateProfilePage } from '../user-create-profile/user-create-profile';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { UserProvider } from '../../providers/user/user';
import { AnalysisPage } from '../analysis/analysis';
import { ViewReviewsPage } from '../view-reviews/view-reviews';


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
  loaderAnimate = true
  public unsubscribeBackEvent: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userservice:UserProvider,
    private authservice : AuthServiceProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    public platform: Platform,
    public app: App) {
setTimeout(()=>{
this.loaderAnimate = false
},2000)
      this.uid = firebase.auth().currentUser.uid;
      this.authservice.setUser(this.uid);
  }
obj ={};

ionViewDidEnter(){
 
}
  ionViewDidLoad() {
   this.getProfile();
   this.initializeBackButtonCustomHandler();
  }
  logout(){
    this.authservice.logoutUser().then(() =>{
      this.navCtrl.setRoot(LoginPage);
    });
  }
  analysis(){
    this.navCtrl.push(ViewReviewsPage)
  }
  viewprofile(){
    this.navCtrl.push( ViewUserPorfilePage)
  }
  bookings(){
    this.navCtrl.push(BookingsPage)
  }

  info(){
    this.navCtrl.push( UserCreateProfilePage)
   
  }
  
  manageSalon(){
    this.navCtrl.push(ManageHairSalonPage)
  }
  getProfile(){
    // create a reference to the collection of users...
    let users = this.db.collection('Users');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.authservice.getUser());
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.obj ={id:doc.id}
this.userservice.userdata.push({...this.obj , ...doc.data()});
          this.displayProfile = doc.data();
          this.SalonOwnerProfile.About = doc.data().About;
          this.SalonOwnerProfile.ownerImage = doc.data().image;
          this.SalonOwnerProfile.ownerSurname = doc.data().surname;
          this.SalonOwnerProfile.ownername = doc.data().name;
          this.SalonOwnerProfile.personalNumber = doc.data().personalNumber;
        this.profile = true;
        })     
      } else {
        console.log('No data');
      this.profile = false;
      }
    }).catch(err => {
      console.log("Query Results: ", err);
    })
  }
  initializeBackButtonCustomHandler() {
    this.unsubscribeBackEvent = this.platform.registerBackButtonAction( () => {
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();                
      //this will not work in signed version using Lazy load use activeView.id instead
      if(activeView.component.name === "LandingPage") {
          // canGoBack check if these's and view in nav stack
          if (nav.canGoBack()){ 
              nav.pop();
          } else {
              let alert = this.alertCtrl.create({
                title: 'Exit Application?',
                message: 'Do you want to exit the application?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Exit',
                    handler: () => {
                      console.log('Exit clicked');
                      this.platform.exitApp();
                    }
                  }
                ]
              });
              alert.present();
          }
      }
    }, 100);

  }
  createAccount(){
    this.navCtrl.setRoot(SalonRegistrationpagePage)
  }


}
