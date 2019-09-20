import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ViewReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-reviews',
  templateUrl: 'view-reviews.html',
})
export class ViewReviewsPage {
  db = firebase.firestore();
  reviews = []
  name: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewReviewsPage');
    // this.getSalon();
    this.getHairSalon();
    console.log('uid',firebase.auth().currentUser.uid);
    
  }


  // getSalon(){
  //   this.db.collection('SalonNode').where("userUID " ,"==",firebase.auth().currentUser.uid).get().then(res =>{
  //     if(res.empty !== true){
  //       res.forEach(doc =>{
  //       console.log('check',doc.data());
        
  //         let query = this.db.collection('SalonNode').doc(doc.data().salonName).collection('ratings');
  //         query.get().then( res =>{
  //           res.forEach( doc  =>{
  //            console.log(doc);
             
  //             this.reviews.push(doc.data());
  //           })
  //         })
  //       })
  //     }
  //   })
  // }
  getHairSalon(){
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   let users = this.db.collection('Salons');
   let query = users.where("userUID", "==", this.authService.getUser());
   query.get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
       
         this.name = doc.data().salonName;
       
     
         this.db.collection('Salons').doc(doc.id).collection('ratings').get().then( res =>{
       res.forEach(doc =>{
 this.reviews.push(doc.data());
         console.log('review' , doc.data());
    
       })
       });
       })
    
     } else {
       console.log('No data');
     }
     load.dismiss();
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
     load.dismiss();
   })
 }
}
