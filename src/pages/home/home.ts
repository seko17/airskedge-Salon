
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
@ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
    private authservice : AuthServiceProvider
    ) {

  }
logout(){
 this.authservice.logoutUser().then(() =>{
   this.navCtrl.setRoot(LoginPage);
 });
}
}
