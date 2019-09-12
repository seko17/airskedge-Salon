import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, LoadingController, AlertController, Popover, PopoverController } from 'ionic-angular';
import { AddSalonPage } from '../add-salon/add-salon';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
import { StyleviewpopoverComponent } from '../../components/styleviewpopover/styleviewpopover';
import { EditstylesPage } from '../editstyles/editstyles';
import { ManageStaffPage } from '../manage-staff/manage-staff';


@IonicPage()
@Component({
  selector: 'page-manage-hair-salon',
  templateUrl: 'manage-hair-salon.html',
})
export class ManageHairSalonPage {
@ViewChild('slider') slider: Slides;
  page = "0";

  isSalon = false;
  isnotSalon = false;

  isHairstyle = false;
  db = firebase.firestore();
  uid
  displayProfile = {}
  disp = {}
  name
  styles = [];
  maleStyles = [];
  femaleStyles = []
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

  analitics =[];
  userRating = [];
  total = 0;
  dummy = []
  aveg: number;
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
//Fubction for getting functionality
    this.analitics;
    firebase.firestore().collection('salonAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val=>{
      val.forEach(data=>{
        console.log(data.data())
        this.analitics.push(data.data());
      })
    })

console.log('salon name', this.SalonNode.salonName);

  }

  selectedTab(ind){
    this.slider.slideTo(ind);
  }

  moveButton($event){
    this.page= $event._snapIndex.toString();
  }

  ionViewDidLoad() {
    this.getHairSalon();
    this.getProfile();
    this.getFemaleStyle();
    this.getMaleStyle();

  }
c(){
  this.authService.logoutUser();
}
 
 
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
        this.isHairstyle = true;
      })
      });
      this.db.collection('SalonNode').doc(doc.data().salonName).collection('ratings').onSnapshot( rates =>{
        rates.forEach( doc =>{
              this.userRating.push(doc.data().rating)
              console.log('users', doc.data().rating);
          
            this.total += doc.data().rating;
            console.log(this.total);
            this.dummy.push(doc.data().rating)
            
            
            })
            this.aveg = this.total / this.dummy.length;
            console.log('averge', this.aveg);
      })
      })
      this.isSalon = true;
      this.isnotSalon = false;
     
    } else {
      console.log('No data');
      this.isSalon = false;
      this.isnotSalon = true;
      this.isHairstyle = false ;
    }
    load.dismiss();
  }).catch(err => {
   
    console.log("Query Results: ", err);
  
    load.dismiss();
  })
}
getMaleStyle(){
  let users = this.db.collection('SalonNode');
  let query = users.where("userUID", "==", this.authService.getUser());
  query.onSnapshot(res =>{
    if (res.empty !== true){
      res.forEach( doc =>{
      this.db.collection('SalonNode').doc(doc.data().salonName).collection('Styles').where("genderOptions","==","male").onSnapshot(snapshot =>{
        this.maleStyles = []
        snapshot.forEach(doc =>{
          this.maleStyles.push(doc.data())
          console.log('male styles here', doc.data());
          
        })
      })
        
      })
    }
  })
}
getFemaleStyle(){
  let users = this.db.collection('SalonNode');
  let query = users.where("userUID", "==", this.authService.getUser());
  query.onSnapshot(res =>{
    if (res.empty !== true){
      res.forEach( doc =>{
      this.db.collection('SalonNode').doc(doc.data().salonName).collection('Styles').where("genderOptions","==","female").onSnapshot(snapshot =>{
        this.femaleStyles = []
        snapshot.forEach(doc =>{
          this.femaleStyles.push(doc.data())
          console.log('female styles here', doc.data());
          
        })
      })
        
      })
    }
  })
}

//Function to push to the user profile page
ViewUserPorfilePage(){
  this.navCtrl.setRoot(ViewUserPorfilePage);
}
//Function to push to adding a new hairstyle
addStyle(){
  this.navCtrl.push(AddhairStylePage);
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
