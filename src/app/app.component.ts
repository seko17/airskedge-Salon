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
        
        firebase.firestore().collection('SalonOwnerProfile').where("uid", "==", user.uid).onSnapshot((result) => {
          if(result.empty) {
            console.log('khuthy');
            this.rootPage = SalonRegistrationpagePage;
         
          }else {
            console.log('no profile');
            this.rootPage = LandingPage;
          
          }
        })
      
      
      } else {
        this.rootPage = LoginPage;
       
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

