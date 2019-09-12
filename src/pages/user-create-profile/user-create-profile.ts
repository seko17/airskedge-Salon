import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.analitics;
    firebase.firestore().collection('salonAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val=>{
      val.forEach(data=>{
        console.log(data.data())
        this.analitics.push(data.data());
      })
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

}
