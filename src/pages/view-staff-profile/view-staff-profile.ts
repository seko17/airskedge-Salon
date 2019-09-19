import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
/**
 * Generated class for the ViewStaffProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-staff-profile',
  templateUrl: 'view-staff-profile.html',
})
export class ViewStaffProfilePage {
  staff = {} as Staff
data
isImage = ''
db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams
    ,  private authUser: AuthServiceProvider,
    public loadingCtrl: LoadingController
    ) {
  
  
   // this.staff.push(this.data);
    
  }

  ionViewDidLoad() {
    this.staff = this.navParams.data;
 
    console.log(this.staff);
  }
  updateAvailiable(){
    let users = this.db.collection('Salons');
    users.doc(firebase.auth().currentUser.uid).collection('staff').where("uid","==",this.staff.name+''+this.staff.staffSurname).get().then(res =>{
      res.forEach(doc =>{
        console.log(doc.id);
        this.staff.isAvialiabe = true;
        this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').doc(doc.id).set(this.staff)
   
      })
    })
  }

  updateNotAvailiable(){
    let users = this.db.collection('Salons');
    users.doc(firebase.auth().currentUser.uid).collection('staff').where("uid","==",this.staff.name+''+this.staff.staffSurname).get().then(res =>{
      res.forEach(doc =>{
        console.log(doc.id);
        this.staff.isAvialiabe = false;
        this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').doc(doc.id).set(this.staff)
   
      })
    })
  }

}
export interface Staff {
  name: string;
  personalNumber: string;
  staffImage: string;
  staffSurname :string,
  uid: string,
  isAvialiabe: boolean,
  date : string;
}