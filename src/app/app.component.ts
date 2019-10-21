import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import {firebaseConfig} from '../app/credentials';
import { LoginPage } from '../pages/login/login';
import { LandingPage } from '../pages/landing/landing';
import { SalonRegistrationpagePage } from '../pages/salon-registrationpage/salon-registrationpage';
import { OneSignal } from '@ionic-native/onesignal';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  signal_app_id: string = 'bf488b2e-b5d1-4e42-9aa5-8ce29e6320c8';
  
  firebase_id:string = '282915271246';

  token
  
  constructor(private screenOrientation: ScreenOrientation, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private oneSignal: OneSignal,public loadingCtrl: LoadingController, public storage: Storage) {

    firebase.initializeApp(firebaseConfig);

  //  this.oneSignal.startInit(this.signal_app_id, this.firebase_id);
  //  this.oneSignal.getIds().then((userID) => {
  //     console.log("user ID ", userID);
  //   })
  //   this.oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);
  //   this.oneSignal.handleNotificationReceived().subscribe((res) => {
  //     // do something when notification is received
  //     console.log(res);
  //   });
  //   this.oneSignal.handleNotificationOpened().subscribe((res) => {
  //     // do something when a notification is opened
  //     console.log(res);
  //   });
  //   this.oneSignal.endInit();
   firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('logged in');
        
        firebase.firestore().collection('Users').where("uid", "==", user.uid).onSnapshot((result) => {
          if(result.empty) {
            console.log('khuthy');
            this.rootPage = SalonRegistrationpagePage;
         
          }else {
            console.log('no profile');
            this.rootPage = LandingPage;
          firebase.firestore().collection('Salons').doc(user.uid).update({
            TokenID: this.token
          })
          }
        })
      
      
      } else {
        this.rootPage = HomePage;
       
      }
    });
    platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#412C39');
      screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      // Okay, so the platform is ready and our plugins are available.
      //private screenOrientation: ScreenOrientation, 
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      setTimeout(()=>{
        splashScreen.hide();
      }, 1000);
      if (platform.is('cordova')) {
      //
        this.setupPush();
      }
    });
  }

  setupPush(){
    this.oneSignal.startInit(this.signal_app_id, this.firebase_id);
     this.oneSignal.getIds().then((userID) => {
        console.log("user ID ", userID);
        this.token = userID.userId
      })
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe((res) => {
        // do something when notification is received
        console.log(res);
      });
      this.oneSignal.handleNotificationOpened().subscribe((res) => {
        // do something when a notification is opened
        console.log(res);
      });
      this.oneSignal.endInit();
  }
}

