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
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;



  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    firebase.initializeApp(firebaseConfig);
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
          
          }
        })
      
      
      } else {
        this.rootPage = HomePage;
       
      }
    });
    platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#1E1E1E');
      // screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      // Okay, so the platform is ready and our plugins are available.
      //private screenOrientation: ScreenOrientation, 
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      setTimeout(()=>{
        splashScreen.hide();
      }, 1000);
    });
  }
}

