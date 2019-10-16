import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the PagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages',
  templateUrl: 'pages.html',
})
export class PagesPage {
picture
pic
  constructor(public navCtrl: NavController, public navParams: NavParams,  public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  this.picture = this.navParams.data
this.pic = this.picture.hairStyleImage
  console.log('data',this.pic);
  
  }
  close(){
    this.navCtrl.pop();
  }

}
