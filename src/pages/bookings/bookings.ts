import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
db = firebase.firestore();
testArray = [];
saloninfo =[];
salonname;
userdata =this.userservice.userdata;
selecteddate;
validated =true;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userservice:UserProvider,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,) {
      console.log(this.userservice.userdata[0].uid)

     this.getsalonname();
 
   
  }

  ionViewDidLoad() {
    
  }

getsalonname()
{
  firebase.firestore().collection('SalonNode').where("userUID","==",this.userservice.userdata[0].uid).get().then(val=>{
    val.forEach(uz=>{
      this.salonname =uz.data().salonName;
      this.gethairdresser(this.salonname )
      this.saloninfo.push(uz.data())
    });
  });

  
}


currentdate:Date;

  getHairSalon(){
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   this.testArray =[];
    this.db.collection('SalonNode').doc(this.salonname).collection('staff').doc(this.hairdresser).collection(this.userdate).get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
         
         let x1=new Date(doc.data().userdate) ;
         let x2=((new Date()).getFullYear()+'-'+(new Date().getMonth())+'-'+new Date().getDate());
       

         console.log("date1",x1)
         console.log("date2",x2)
         if(x1.getMonth() ==(new Date().getMonth()) && (new Date().getDate()) ==x1.getDate() )
         {
this.validated =false;
console.log("it worked = true")
         }
         else
         {
          this.validated =true;
          console.log("it worked =false")
         }
         this.testArray.push(doc.data());
    
       })
   
     } else {
       console.log('No data');

       const alert = this.alertCtrl.create({
        message: 'There are no bookings for '+this.hairdresser+' for '+this.userdate,
        buttons: ['OK']
      });
     alert.present();
     }
     load.dismiss();
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
     load.dismiss();
   })
 }
 
 
 //Function to push to the user profile page
 ViewUserPorfilePage(){
   this.navCtrl.push(ViewUserPorfilePage);
 }
 //Function to push to adding a new hairstyle
 addStyle(){
   this.navCtrl.push(AddhairStylePage)
 }
 
 testarray;
events;
d1;
d2;
d3;
 

  staff =[];
  gethairdresser(x)
  {
   return this.db.collection('SalonNode').doc(this.salonname).collection('staff').get().then(val=>{
    val.forEach(stav=>{
      
this.staff.push(stav.data());
console.log(this.staff)
    })
  });

 
  }

hairdresser;
userdate;
  view()
  {

    console.log(this.hairdresser,this.userdate)
    this.getHairSalon()
  }
  updatebooking(n)
  {
    console.log(n);
  }


}

