import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewReviewsPage } from '../view-reviews/view-reviews';
import { BookingsPage } from '../bookings/bookings';
/**
 * Generated class for the AnalysisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-analysis',
  templateUrl: 'analysis.html',
})
export class AnalysisPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalysisPage');
  }
  reviews(){
    this.navCtrl.push(ViewReviewsPage);
  }

  goToHome(){
    this.navCtrl.push(BookingsPage);
  }

}
