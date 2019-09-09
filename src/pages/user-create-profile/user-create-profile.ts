import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
/**
 * Generated class for the UserCreateProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-create-profile',
  templateUrl: 'user-create-profile.html',
})
export class UserCreateProfilePage {
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

}
