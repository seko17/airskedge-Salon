import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Popover, PopoverController } from 'ionic-angular';
import { AddSalonPage } from '../add-salon/add-salon';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
import { StyleviewpopoverComponent } from '../../components/styleviewpopover/styleviewpopover';
import { EditstylesPage } from '../editstyles/editstyles';
import { ManageStaffPage } from '../manage-staff/manage-staff';
/**
 * Generated class for the ManageHairSalonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-hair-salon',
  templateUrl: 'manage-hair-salon.html',
})
export class ManageHairSalonPage {
  isSalon = false;
  isnotSalon = false;

  isHairstyle = false;
  db = firebase.firestore();
  uid
  displayProfile = {}
  disp = {}
  name
  styles = [];
  SalonNode = {
    salonName: '',
    salonImage: '',
    salonLogo: '',
    location: '',
    numHairDressers: '',
    SalonDesc: '',
    SalonContactNo: '',
    userUID: ''


  }
  SalonOwnerProfile = {
    ownerImage: '',
    ownername: '',
    ownerSurname: '',
    personalNumber: '',
    About: '',
    uid: ''

  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private popoverCtrl : PopoverController) {

      this.uid = firebase.auth().currentUser.uid;
    this.authService.setUser(this.uid);
    console.log('check salon profile',this.displayProfile); 
    
    console.log('check',this.styles)     
  }

  ionViewDidLoad() {
    this.getHairSalon();
    this.getProfile();

  }
c(){
  this.authService.logoutUser();
}
  //function to go to manage staff page  
 
  //Function to go to add Salon page only visisble when there's no availiable salon
addSalon(){
  this.navCtrl.push(AddSalonPage);
}
//function to view style
viewStyle(v){
  const popover = this.popoverCtrl.create(StyleviewpopoverComponent, v);
  popover.present();
}
//function to edit
edithairstlye(v){
  this.navCtrl.push(EditstylesPage,v)
}
editProfile()
{
  this.isSalon = false;
}
//Function to delete style
Delete(value){
 const alert = this.alertCtrl.create({
      title: 'Delete',
      subTitle: 'Are you sure you want to delete this Style?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },{
          text : 'Delete',
          handler : () =>{
            const worker = this.loadingCtrl.create({
              content: 'deleting, please wait',
              spinner: 'bubbles'
            })
            worker.present();
            let users = this.db.collection('SalonNode');
            let query = users.where("userUID", "==", this.authService.getUser());
            query.get().then( snap => {
              if (snap.empty !== true){
                console.log('Got data', snap);
                snap.forEach(doc => {
                  console.log('Delete Document: ', doc.data())
                  this.displayProfile = doc.data();
          
                  this.db.collection('SalonNode').doc(doc.data().salonName).collection('Styles').doc(value.hairstyleName).delete().then( res =>{
                    worker.dismiss();
                    this.styles = [];
                    this.getHairSalon();
                   
                    const alerter =  this.alertCtrl.create({
                      message: 'Style deleted'
                    })
                    alerter.present();
                });
             
                })
             
              } 
             
            })
          }
        }
      ]

    });
    alert.present();
 
}

//function to get Hair Salon and hair styles
getHairSalon(){
   let load = this.loadingCtrl.create({
    content: 'Please wait...',
    spinner: 'dots'
  });
  load.present();
  let users = this.db.collection('SalonNode');
  let query = users.where("userUID", "==", this.authService.getUser());
  query.get().then( snap => {
    if (snap.empty !== true){
      console.log('Got data', snap);
      snap.forEach(doc => {
        console.log('Profile Document: ', doc.data())
        this.disp = doc.data();
        this.name = doc.data().salonName;
      
        this.SalonNode.salonImage = doc.data().salonImage;
        this.SalonNode.salonImage = doc.data().salonName;
        this.db.collection('SalonNode').doc(doc.data().salonName).collection('Styles').get().then( res =>{
      res.forEach(doc =>{
this.styles.push(doc.data());
        console.log('styles' , doc.data());
        this.isHairstyle = true;
      })
      });
      })
      this.isSalon = true;
      this.isnotSalon = false;
    } else {
      console.log('No data');
      this.isSalon = false;
      this.isnotSalon = true;
    }
    load.dismiss();
  }).catch(err => {
   
    console.log("Query Results: ", err);
  
    load.dismiss();
  })
}


//Function to push to the user profile page
ViewUserPorfilePage(){
  this.navCtrl.setRoot(ViewUserPorfilePage);
}
//Function to push to adding a new hairstyle
addStyle(){
  this.navCtrl.setRoot(AddhairStylePage);
}
viewstaff(){
  this.navCtrl.setRoot( ManageStaffPage);
}

getProfile(){
  
  let users = this.db.collection('SalonOwnerProfile');

  let query = users.where("uid", "==", this.authService.getUser());
  query.get().then(querySnapshot => {
  
    if (querySnapshot.empty !== true){
      console.log('Got data', querySnapshot);
      querySnapshot.forEach(doc => {
        console.log('Profile Document: ', doc.data())
        this.displayProfile = doc.data();
        this.SalonOwnerProfile.About = doc.data().About;
        this.SalonOwnerProfile.ownerImage = doc.data().ownerImage;
        this.SalonOwnerProfile.ownerSurname = doc.data().ownerSurname;
        this.SalonOwnerProfile.ownername = doc.data().ownername;
        this.SalonOwnerProfile.personalNumber = doc.data().personalNumber;
      
      })
     
    } else {
      console.log('No data');
    
    }
    // dismiss the loading
   
  }).catch(err => {
    // catch any errors that occur with the query.
    console.log("Query Results: ", err);
    // dismiss the loading
  
  })
}

goback(){
  this.navCtrl.pop();
}

}
