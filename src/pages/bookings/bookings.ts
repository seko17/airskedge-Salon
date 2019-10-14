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
currentday;
currentEvents = [];
hairdresser
  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams,public userservice:UserProvider,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private localNotifications: LocalNotifications,
    private oneSignal: OneSignal) {
      console.log(this.userservice.userdata[0].uid)

     this.getsalonname();
     this.gethairdresser();
     this.currentday =this.cdate()
  }
  obj ={};
  ionViewDidLoad() {
 
     

   this.currentEvents =this.userservice.currentEvents;
      }
  


  // getLocalNotification(){
  //   this.db.collection('Bookings').where("salonuid", "==", this.authService.getUser()).onSnapshot(doc =>{
  //     doc.forEach(res =>{
  //       console.log('datas ',res.data())
   
  //         this.localNotifications.schedule({
  //           id: 1,
  //           title: 'Airskedge',
  //           text: 'New Booking has been made',
        
       
  //         });

  //     })
    
      
  //   })
  // }

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
    let load = this.loadingCtrl.create({
      content: `
      <ion-refresher (ionRefresh)="doRefresh($event)">
    <ion-refresher-content 
    refreshingSpinner="customcircles">
    </ion-refresher-content>
  </ion-refresher>`,
     spinner: 'dots'
   });
   load.present();


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
      title: 'Cancel!',
      message: "Are you sure you want to cancel session with "+x.name+'?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            console.log('Cancel clicked');
           this.cancelbooking =true;

        
           console.log("USER Clicked", x);
       
           x.status = "cancelled";

           firebase.firestore().collection('Bookings').doc(x.id).delete();
          //  firebase.firestore().collection('Bookings').doc(x.id).update({
          //    status2: 'cancelled'
          //  }).then(res => {
          //    console.log(res)
          //  });





           if( x.UserTokenID){
            var notificationObj = {
              headings: {en: "CANCELLATION ALERT!" },
              contents: { en: " Hey "+ x.name + ", "+ x.salonname + " has canceled their booking with you "  },
              include_player_ids: [x.UserTokenID],
            }
            this.oneSignal.postNotification(notificationObj).then(res => {
             // console.log('After push notifcation sent: ' +res);
            })
          }
           
           firebase.firestore().collection('Analytics').doc(x.salonuid).get().then(val=>{
         
             console.log("numbers = ",val.data())
          
             firebase.firestore().collection('Analytics').doc(x.salonuid).set({numberofviews:val.data().numberofviews,numberoflikes:val.data().numberoflikes,usercancel:val.data().usercancel,saloncancel:val.data().saloncancel+1,allbookings:val.data().allbookings,users:val.data().users});
           });
            

          }
        },
        {
          text: 'No',
          handler: data => {
            console.log(data);
         this.cancelbooking =false;
         console.log(this.cancelbooking)

         
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

}




