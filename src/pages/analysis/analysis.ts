import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';
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
  @ViewChild('slides') slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,public vw:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalysisPage');
  }
  reviews(){
    this.navCtrl.push(ViewReviewsPage);
  }

  goToHome(){
    this.vw.dismiss();
  }
  
  hidden:boolean =false;
  ionViewDidEnter()
  {
    this.hidden =false;
  }

  slideState() {
  
    console.log("Index = ",this.slides._activeIndex)
    if(this.slides._activeIndex == 2)
    {
      this.hidden =true;
    }
  }

  nextState() {
    this.slides.slideNext();
    console.log("Index = ",this.slides._activeIndex)
    if(this.slides._activeIndex == 2)
    {
      this.hidden =true;
    }
  }

}
