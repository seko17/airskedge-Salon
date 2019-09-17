
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AddSalonPage } from '../add-salon/add-salon';
import { CreateAccountPage } from '../create-account/create-account';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
@ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController,
    private authservice : AuthServiceProvider
    ) {
      // this.slides.lockSwipeToPrev(true);
  }
logout(){
 this.authservice.logoutUser().then(() =>{
   this.navCtrl.setRoot(LoginPage);
 });
}

addSalon(){
  this.navCtrl.push(AddSalonPage);
}
home(){
  this.navCtrl.setRoot(LoginPage)
}


register(){
  this.navCtrl.setRoot(CreateAccountPage);
}
}
