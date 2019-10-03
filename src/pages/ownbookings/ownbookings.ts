import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
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
  constructor(public user:UserProvider,private alertCtrl: AlertController,params: NavParams,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController) {
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

    this.testbooking(booking)
  }






  events;
  testarray2;
  preventinputs;
  isvalidated =false;

testbooking(booking) {

  this.events = [];
  let hourRange = parseFloat(booking.sessiontime[0] + booking.sessiontime[1]);
  let minuteRange = parseFloat(booking.sessiontime[3] + booking.sessiontime[4])

  firebase.firestore().collection('Bookings').where("salonuid","==",booking.salonuid).where("hairdresser","==",booking.hairdresser).orderBy("userdate", "desc").limit(50).get().then(val => {
  if(val.empty)
  {
    this.isvalidated =false;
    this.preventinputs=true;
    console.log("heya!!!")
  }
    val.forEach(doc => {
      this.testarray.push(doc.data());

     // console.log(doc.data())
    

    });

  });

  this.presentConfirm(booking)
  console.log("here = ",this.testarray,this.testarray.length)
 

}




presentToast() {
  let toast = this.toastCtrl.create({
    message: 'There is already a booking at this time and date!',
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
    title: 'Confirm purchase',
    message: 'Do you want to buy this book?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Buy',
        handler: () => {

          this.user.findtime(booking,this.testarray);
          console.log('Buy clicked');
        }
      }
    ]
  });
  alert.present();
}


}