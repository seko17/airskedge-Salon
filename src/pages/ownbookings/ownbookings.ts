import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { bookings } from '../../app/booking';
import * as firebase from 'firebase';
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
  constructor(params: NavParams,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams) {
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
  }
}
