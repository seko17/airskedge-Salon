import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { SMS } from '@ionic-native/sms';

@IonicPage()
@Component({
  selector: 'page-user-create-profile',
  templateUrl: 'user-create-profile.html',
})
export class UserCreateProfilePage {

aboutUs=true;
disclaimer=true;
terms=true;
legal=true;
analytics=true;

analitics =[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private sms: SMS) {
 
    firebase.firestore().collection('Analytics').doc(firebase.auth().currentUser.uid).get().then(val=>{
      val.data();
      this.analitics.push( val.data())
      console.log(val.data());
    })
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCreateProfilePage');
  }

  getAbout(){
    this.aboutUs=!this.aboutUs
  }

  getdisclaimer(){
    this.disclaimer=!this.disclaimer
  }

  getterms(){
    this.terms=!this.terms
  }

  getlegal(){
    this.legal=!this.legal
  }

  getanalytics(){
    this.analytics=!this.analytics
  }
  sendSms(){
    let options = {
      replaceLineBreaks: true, // true to replace \n by a new line, false by default
      android: {
          intent: 'INTENT'  // send SMS with the native android SMS messaging
          //intent: '' // send SMS without opening any other app
      }
  };

  this.sms.send('0747232116', 'IT is working',options).then((smsresp)=>{
console.log('it wroked');

  })
  }
 
}
