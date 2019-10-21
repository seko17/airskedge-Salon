import { Component } from '@angular/core';
import {  ViewController ,IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { OneSignal } from '@ionic-native/onesignal';
import { OwnbookingsPage } from '../ownbookings/ownbookings';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AnalysisPage } from '../analysis/analysis';
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
testArray = this.userservice.prebookings;
saloninfo =[];
salonname;
userdata =this.userservice.userdata;
selecteddate;
validated =true;
currentday;
currentEvents = [];
hairdresser;
  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams,public userservice:UserProvider,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private localNotifications: LocalNotifications,
    private oneSignal: OneSignal,public platform: Platform,
    public storage: Storage) {
      console.log(this.userservice.userdata[0].uid)
     this.getsalonname();
     this.gethairdresser();
     this.currentday =this.cdate();
    

     this.platform.ready().then(() => {
      this.storage.get('introShown').then((result) => {
  console.log(result)
        if(result){
          console.log("got it")
        } else {
          let profileModal = this.modalCtrl.create(AnalysisPage);
          profileModal.onDidDismiss(data => {
            console.log(data);
            this.toast();
          });
          profileModal.present();
          this.storage.set('introShown', true);
          console.log(this.storage)
  
  
          
        }
    
      });
    });

  }
  obj ={};
  ionViewDidLoad() {   
   this.currentEvents =this.userservice.currentEvents;
      }
  

getsalonname()
{
  console.log("YES")
  firebase.firestore().collection('Salons').where("salonuid","==",firebase.auth().currentUser.uid).get().then(val=>{
    val.forEach(uz=>{
      console.log(uz.data());
      this.gethairdresser( );
      this.saloninfo.push(uz.data())
    });
  });
  
  
}
currentdate:Date;
  getHairSalon(){
   
   this.testArray =[];
    this.db.collection('Bookings').where("salonuid","==",this.userservice.userdata[0].uid).where("userdate","==",this.userdate).where("hairdresser","==",this.hairdresser).get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
        console.log('data',doc.id, doc.data())
        
         
         let x1=new Date(doc.data().userdate) ;
         let x2=((new Date()).getFullYear()+'-'+(new Date().getMonth())+'-'+new Date().getDate());
       
       this.obj ={id:doc.id}
         this.testArray.push({...this.obj, ...doc.data()});
         console.log("Manipulate this date",x1)
        
        // this.onDaySelect(doc.data());
         console.log(this.testArray)
         //console.log("date1",x1)
         //console.log("date2",x2)
         if(x1.getMonth() ==(new Date().getMonth()) && (new Date().getDate()) ==x1.getDate() )
         {
this.validated =false;
//console.log("it worked = true")
         }
         else
         {
          this.validated =true;
          console.log("it worked =false")
         }
         
         console.log(this.obj)
        // this.staff.push(doc.data());
      
    console.log(this.staff)
       })
   
     } else {
       console.log('No data');
       const alert = this.alertCtrl.create({
        message: 'There are no bookings for '+this.hairdresser+' for '+this.userdate,
        cssClass: 'alertDanger',
        buttons: ['OK']
      });
     alert.present();
     }
    
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
   
   })

 }
 
 
 
 testarray;
events;
d1;
d2;
d3;
  staff =[];
  gethairdresser()
  {
   return this.db.collection('Salons').doc(this.userservice.userdata[0].uid).collection('staff').where("isAvialiabe","==",true).get().then(val=>{
    val.forEach(stav=>{
      this.obj ={id:stav.id}
this.staff.push({...this.obj, ...stav.data()});
console.log(this.staff)
    })
  });
 
  }
userdate;
  view()
  {
    console.log(this.hairdresser,this.userdate)
    if(this.hairdresser ==undefined)
    {
    console.log("error")
    this.presentAlert();
    }
    else{
      this.getHairSalon();
    }
    
  }
  cancelbooking:boolean;
  cancels(x)
  {
    console.log("This is user input =",x);
    
console.log(this.hairdresser,this.userdate)
  
    const prompt = this.alertCtrl.create({
      title: 'Alert!',
      message: "Are you sure you want to cancel session with "+x.name+'?',
      cssClass: 'alertDanger',
      buttons: [
       
        {
          text: 'No',
          handler: data => {
            console.log(data);
         this.cancelbooking =false;
         console.log(this.cancelbooking)
         
          }
          ,
          
        },
        {
          text: 'Yes',
          handler: () => {
           
            this.getHairSalon();
            x.status2="cancelled"
            x.status="cancelled"
   
            firebase.firestore().collection('Bookings').doc(x.id).delete();
            firebase.firestore().collection('Cancellations').add(x);
            //this.cancelbookingToast();
            console.log('Confirm Okay');
            
              var notificationObj = {
                headings: { en: "APPOINTMENT CANCELLATION! " },
                contents: { en: "Hey "+ x.name + ", "+x.haidresser + " from "+ x.salonname + " has cancelled their booking with you"},
                include_player_ids: [x.UserTokenID],
              }
              this.oneSignal.postNotification(notificationObj).then(res => {
                // console.log('After push notifcation sent: ' +res);
              })
            
            firebase.firestore().collection('Analytics').doc(x.salonuid).get().then(val => {
              console.log("numbers = ", val.data())
              firebase.firestore().collection('Analytics').doc(x.salonuid).set({ numberofviews: val.data().numberofviews, numberoflikes: val.data().numberoflikes, usercancel: val.data().usercancel , saloncancel: val.data().saloncancel+ 1, allbookings: val.data().allbookings, users: val.data().users });
            });
          }
        }
      ]
    });
    prompt.present();
   
/////////////////////////////////////////////////////////////
  }
  todate;
  
  onDaySelect(event)
  {
console.log(event);
event.year;
event.month;
event.date;
console.log(event.year,
  event.month,
  event.date)
  this.todate = (event.year)+'-'+(event.month)+'-'+(event.date);
  if((event.month+1)<10)
  {
    this.todate = (event.year)+'-0'+(event.month+1)+'-'+(event.date);
  if((event.date)<10)
  {
    this.todate = (event.year)+'-0'+(event.month+1)+'-0'+(event.date);
  }
}
if((event.month+1)>9)
  {
    this.todate = (event.year)+'-'+(event.month+1)+'-'+(event.date);
  if((event.date)<10)
  {
    this.todate = (event.year)+'-'+(event.month+1)+'-0'+(event.date);
  }
}
this.userdate =this.todate;
console.log("Currentdate =",this.userdate)
  }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Caution!',
      cssClass: 'alertDanger',
      subTitle: 'Select the name of the hairdresser first.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  calendar = {
    mode: 'month',
    currentDate: new Date()
  }; 
onDateSelected() {
alert('asd');
}
onCurrentDatechanged($event){
alert('onCurrentDatechanged');
}
onEventSelected($event){
alert('onEventSelected');
}
onTitleChanged($event){
alert('onTitleChanged');
}
onTimeSelected($event){
alert('onTimeSelected');
}
cdate() {
  let todate;
  todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth()) + '-' + (new Date().getDate());
  if ((new Date().getMonth() + 1) < 10) {
 
  todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
    if ((new Date().getDate()) < 10) {
    todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
    }
 
  }
  else if ((new Date().getMonth() + 1) >= 10)
 {
   todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
 
   if ((new Date().getDate()) < 10) {
   todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
   }
 }
  console.log("Currentdate =", todate)
  return todate;
 }
 bookingModal() {
   if(this.userdate ==undefined||this.hairdresser==undefined)
   {
    this.present();
}
else
{
  let bookingModal = this.modalCtrl.create(OwnbookingsPage,{ hairdresser: this.hairdresser,userdate:this.userdate });
  bookingModal.present();
  bookingModal.onDidDismiss(data => {
    console.log(data);
    this.testArray=[];
    this.userservice.prebookingsfunction();
    this.testArray =this.userservice.prebookings;
  });
}
}
present() {
  let alert = this.alertCtrl.create({
    title: 'Missing information!',
    subTitle: 'Select a hairdresser then the date before creating a local booking.',
    buttons: ['Dismiss']
  });
  alert.present();
}
paid(n)
{
console.log(n)
  let alert = this.alertCtrl.create({
    title: 'Has the client payed for the service?',
    message: 'If you click yes, your client will be able to review your salon.',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          firebase.firestore().collection('Bookings').doc(n.id).update({
            payment: 'Paid'
            }).then(res => {
             console.log(res)
             this.testArray=[];
          this.userservice.prebookingsfunction();
    this.testArray =this.userservice.prebookings;
          });


          if(n.useruid ==undefined)
          {
            console.log(n.useruid)
            let toast = this.toastCtrl.create({
              message: 'Local bookings cannot be permitted to review your salon.',
              duration: 6000,
              position: 'bottom'
            });
            toast.present(); 
          }
          else
          {
          this.db.collection('Payments').doc(n.useruid).set ({date:n.userdate,useruid:n.useruid,salonuid:n.salonuid});
         
        this.presentConfirm();
        
        }
        }
      }
    ]
  });
  alert.present();
}
presentConfirm() {
  let toast = this.toastCtrl.create({
    message: 'Client payment recorded successfully.',
    duration: 6000,
    position: 'bottom'
  });
  toast.present(); 
}




info()
{
  console.log("clicked");
  this.platform.ready().then(() => {
    this.storage.get('introShown').then((result) => {
console.log(result)
      if(result){
        console.log("got it")

        let profileModal = this.modalCtrl.create(AnalysisPage);
        profileModal.onDidDismiss(data => {
          console.log(data);
          this.toast();
        });
        profileModal.present();

      } else {
       this.navCtrl.push(AnalysisPage);
        this.storage.set('introShown', true);
        console.log(this.storage)


        
      }
  
    });
  });
}


toast()
{


  let toast = this.toastCtrl.create({
    message: 'Select a haidresser, then pick the date to view their bookings for that day.',
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();


}


}
