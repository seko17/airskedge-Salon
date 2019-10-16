import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { ManageStaffPage } from '../manage-staff/manage-staff';
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
isStaff = false
db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams
    ,  private authUser: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    ) {
  
  
   // this.staff.push(this.data);
    
  }

  ionViewDidLoad() {
    this.staff = this.navParams.data;
 
    console.log(this.staff);
  }
  updateAvailiable(){
    this.presentLoading()
    let users = this.db.collection('Salons');
    users.doc(firebase.auth().currentUser.uid).collection('staff').where("uid","==",this.staff.name+''+this.staff.staffSurname).get().then(res =>{
      res.forEach(doc =>{
        console.log(doc.id);
        this.staff.isAvialiabe = true;
        this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').doc(doc.id).set(this.staff)
   
      })
    })
  }
  Delete() {
    const alert = this.alertCtrl.create({
      title: 'Delete',
      subTitle: 'Are you sure you want to delete '+this.staff.name+ " ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Delete',
          handler: () => {
            const worker = this.loadingCtrl.create({
              content: 'deleting, please wait',
              spinner: 'bubbles'
            })
            worker.present();
            let query = this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').where("name", "==", this.staff.name)
            query.get().then(snap => {
              snap.forEach(doc => {
                console.log('Delete Document: ', doc.data())
                // this.displayProfile = doc.data();
                this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').doc(doc.id).delete().then(res => {
                  this.navCtrl.push(ManageStaffPage)
                  worker.dismiss();
                });
              })
            })
          }
        }
      ]

    });
    alert.present();

  }


  updateNotAvailiable(){
    this.presentLoading()
    let users = this.db.collection('Salons');
    users.doc(firebase.auth().currentUser.uid).collection('staff').where("uid","==",this.staff.name+''+this.staff.staffSurname).get().then(res =>{
      res.forEach(doc =>{
        console.log(doc.id);
        this.staff.isAvialiabe = false;
        this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').doc(doc.id).set(this.staff)
   
      })
    })
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1000
    });
    loader.present();
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