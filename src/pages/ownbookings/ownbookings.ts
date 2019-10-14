import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { bookings } from '../../app/booking';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the OwnbookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ownbookings',
  templateUrl: 'ownbookings.html',
})
export class OwnbookingsPage {
hairdresser;
userdate;
testarray=[];
  constructor(public loadingCtrl: LoadingController,public user:UserProvider,private alertCtrl: AlertController,params: NavParams,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController) {
  this.hairdresser =params.get('hairdresser');
  this.userdate =params.get('userdate');




    console.log('hairdresser', this.hairdresser);
    console.log('userdate', this.userdate);
  }

  booking: bookings = {
    name: "",
    surname: "",
    hairstyletype:"",
    hairstyleprice: "",
    sessiontime: undefined,
    sessionendtime: undefined,
    hairdresser: this.hairdresser,
    userdate: this.userdate,
    salonuid: firebase.auth().currentUser.uid,
    hairstyleimage: "https://images.pexels.com/photos/2528695/pexels-photo-2528695.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
    UserTokenID: "",
    payment:"Unpaid"
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnbookingsPage');
  }
  closemodal()
  {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  submit(booking)
  {
    booking.hairdresser =this.hairdresser;
    booking.userdate =this.userdate;
    console.log("booking info =", booking)

    if(new Date(booking.userdate+'T'+booking.sessiontime).getHours()*60+new Date(booking.userdate+'T'+booking.sessiontime).getMinutes()>=new Date(booking.userdate+'T'+booking.sessionendtime).getHours()*60+new Date(booking.userdate+'T'+booking.sessionendtime).getMinutes() )
    {
      this.present6();
    }
    else
   
    if(booking.name==undefined || booking.name=="")
{
  this.present1();
}
else 
if(booking.surname==undefined || booking.surname=="")
{
  this.present2();
}
else
if(booking.hairstyletype==undefined || booking.hairstyletype=="")
{
  this.present3();
}
else
if(booking.hairstyleprice==undefined || booking.hairstyleprice=="")
{
  this.present4();
}
else
if(booking.sessiontime ==undefined || booking.sessionendtime==""||booking.sessiontime =="" || booking.sessionendtime==undefined)
{
 this.present5()
}

    else
    {
      this.testbooking(booking)
    }



    
  }






  events;
  testarray2;
 
  isvalidated =false;

testbooking(booking) {
this.testarray =[];
  this.events = [];
  let hourRange = parseFloat(booking.sessiontime[0] + booking.sessiontime[1]);
  let minuteRange = parseFloat(booking.sessiontime[3] + booking.sessiontime[4])

  firebase.firestore().collection('Bookings').where("salonuid","==",booking.salonuid).where("hairdresser","==",booking.hairdresser).where("userdate","==",this.userdate).get().then(val => {
  if(val.empty)
  {
    this.isvalidated =false;
    
    console.log("heya!!!")
  }
    val.forEach(doc => {
      this.testarray.push(doc.data());

     // console.log(doc.data())
    

    });

  });

  this.presentLoadingDefault(booking);
  console.log("here = ",this.testarray,this.testarray.length)
 

}







presentLoadingDefault(booking) {
  let loading = this.loadingCtrl.create({
    content: `
    <ion-refresher (ionRefresh)="doRefresh($event)">
  <ion-refresher-content 
  refreshingSpinner="customcircles">
  </ion-refresher-content>
</ion-refresher>`,
    duration: 3000,
    spinner: 'dots'
  });

  loading.present();

  loading.onDidDismiss(() => {
    this.findtime(booking,this.testarray);
    console.log('Dismissed loading');
  });

 



 
}








d1;d2;d3;


findtime(booking,ara) {
  this.testarray=ara;

  this.events = [];
  this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime)).getHours();
  this.d2 = new Date((booking.userdate + 'T0') + (booking.sessionendtime)).getHours();
  this.d3;

  
console.log(this.testarray,this.testarray.length)
  //this.formodal=false;

 // console.log("TestArray = ", this.testarray)
let val =this.testarray.length;

  for (let i = 0; i < val; i++) {

    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime)).getHours()*60+new Date((booking.userdate + 'T') + (booking.sessiontime)).getMinutes();

    this.d2 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessiontime)).getHours()*60+new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessiontime)).getMinutes();


   //console.log("Second condition for end time =", (this.testarray[i].sessionendtime[0]))

    this.d3 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessionendtime)).getHours()*60+new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessionendtime)).getMinutes();


    let d4 = new Date((booking.userdate + 'T') + (booking.sessionendtime)).getHours();


    console.log(" d1 =",this.d1," d2 =",this.d2," d3= ",this.d3);


    if( this.d2 <= this.d1 && this.d1 < this.d3 ) 
    {

   
      this.isvalidated = true;
      this.presentToast(booking);
   
     console.log("Booking Error slot occupied ")
 
  
return 0;
    }

    else {
      this.isvalidated = false;
      // console.log(" d1 =",this.d1," d2 =",this.d2," d3= ",this.d3);
       console.log("holy")

 
     
   

    }
  }



  if(this.isvalidated==false)
  {
    console.log("Validated")
    this.presentConfirm(booking)
  }
}



presentToast(booking) {
  let toast = this.toastCtrl.create({
    message: booking.hairdresser +' is already booked on '+booking.userdate+' at '+booking.sessiontime+".\n Check your calendar for appointments.",
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}



bookingsuccessfulToast() {

  let toast = this.toastCtrl.create({
    message: "Your booking was successfully added.",
    duration: 5000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}




presentConfirm(booking) {
  let alert = this.alertCtrl.create({
    title: 'Confirm booking',
    message: 'The current time is available for booking?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Proceed',
        handler: () => {

        
          console.log('Buy clicked');


          firebase.firestore().collection('Analytics').doc(booking.salonuid).get().then(val=>{

            console.log("numbers = ",val.data())
         
            firebase.firestore().collection('Analytics').doc(booking.salonuid).set({numberofviews:val.data().numberofviews,numberoflikes:val.data().numberoflikes,usercancel:val.data().usercancel,saloncancel:val.data().saloncancel,allbookings:val.data().allbookings+1,users:val.data().users});
          });
      
      
      
          firebase.firestore().collection('Bookings').add(booking).then(result => {
            console.log(result)
          });
      
          console.log("query info =", booking.salonname, booking.hairdresser, booking.userdate, booking.hairdresser)
          this.bookingsuccessfulToast();
          this.viewCtrl.dismiss();
        
        }
      }
    ]
  });
  alert.present();
}


present1() {
  let toast = this.toastCtrl.create({
    message: 'Enter the name of the client.',
    duration: 4000,
    position: 'bottom'
  });


  toast.present();
}



present2() {
  let toast = this.toastCtrl.create({
    message: 'Enter the surname of the client.',
    duration: 4000,
    position: 'bottom'
  });


  toast.present();
}

present3() {
  let toast = this.toastCtrl.create({
    message: 'Enter the name of the hairstyle.',
    duration: 4000,
    position: 'bottom'
  });


  toast.present();
}


present4() {
  let toast = this.toastCtrl.create({
    message: 'Enter the price of the hairstyle.',
    duration: 4000,
    position: 'bottom'
  });


  toast.present();
}

present5() {
  let toast = this.toastCtrl.create({
    message: 'Enter start time and the end time.',
    duration: 4000,
    position: 'bottom'
  });


  toast.present();
}
present6()
{
  let toast = this.toastCtrl.create({
    message: 'End Time cannot be greater than Start Time.',
    duration: 4000,
    position: 'bottom'
  });


  toast.present();
}


}