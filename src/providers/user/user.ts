import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { bookings } from '../../app/booking';
import { ToastController, AlertController } from 'ionic-angular';
/*
 Generated class for the UserProvider provider.
 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
*/
@Injectable()
export class UserProvider {
 userdata=[];
currentEvents =[];
db =firebase.firestore();
currentdate;
futuredate;
formodal: boolean = false;
item = true;
  unit: string;
  unit1: string;
  staff = [];
  testarray = [];
  markDisabled;

  isvalidated = true;






 constructor(public toastCtrl:ToastController,public alertCtrl:AlertController) {
 

  
      this.db.collection('Bookings').where("salonuid","==",firebase.auth().currentUser.uid).where("userdate",">=",this.cdate()).get().then( snap => {
       
         
          snap.forEach(doc => {
           console.log('data',doc.id, doc.data())
           
            
            let x1=new Date(doc.data().userdate) ;
         
          
      
   
            console.log("Manipulate this date",x1)
            this.currentEvents.push({year:x1.getFullYear(),month:x1.getMonth(),date:x1.getDate()})
            console.log(this.currentEvents)
            this.currentEvents =this.currentEvents;
          })})



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






userbookings(booking: bookings) {
  console.log(booking)


  let click = 1;
  let v1;
  let docid;
   

  firebase.firestore().collection('Analytics').doc(booking.salonuid).get().then(val=>{

    console.log("numbers = ",val.data())
 
    firebase.firestore().collection('Analytics').doc(booking.salonuid).set({numberofviews:val.data().numberofviews,numberoflikes:val.data().numberoflikes,usercancel:val.data().usercancel,saloncancel:val.data().saloncancel,allbookings:val.data().allbookings+1,users:val.data().users});
  });



  firebase.firestore().collection('Bookings').add(booking).then(result => {
    console.log(result)
  });

  console.log("query info =", booking.hairdresser, booking.userdate, booking.hairdresser)
 

}


salonbooking;
holduserinput(booking)
{
 this.salonbooking =booking; 
}


events =[];
d1;d2;d3;


findtime(booking,ara) {
  this.testarray=ara;

  this.events = [];
  this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));
  this.d2 = new Date((booking.userdate + 'T0') + (booking.sessionendtime));
  this.d3;

  
console.log(this.testarray,this.testarray.length)
  //this.formodal=false;

 // console.log("TestArray = ", this.testarray)
let val =this.testarray.length;

  for (let i = 0; i < val; i++) {

    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime)).toTimeString();

    this.d2 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessiontime)).toTimeString();


   //console.log("Second condition for end time =", (this.testarray[i].sessionendtime[0]))

    this.d3 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessionendtime)).toTimeString();


    let d4 = new Date((booking.userdate + 'T') + (booking.sessionendtime)).toTimeString();


    console.log(" d1 =",this.d1," d2 =",this.d2," d3= ",this.d3);


    if( this.d2 <= this.d1 && this.d1 < this.d3 ) 
    {

   
      this.isvalidated = true;
      this.presentToast(booking);
   
     console.log("Booking Error slot occupied ")
 
    i =5000000000000000000000;
return 0;
    }

    else {
      this.isvalidated = false;
      // console.log(" d1 =",this.d1," d2 =",this.d2," d3= ",this.d3);
       console.log("holy")

      i =5000000000000000000000;
     
   

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



bookingsuccessfulToast(booking) {

  let toast = this.toastCtrl.create({
    message: "Your booking was successfully added",
    duration: 3000,
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
         
      
        
        }
      }
    ]
  });
  alert.present();
}


}