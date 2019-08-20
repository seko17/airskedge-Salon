import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AddSalonPage } from '../add-salon/add-salon';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private authservice : AuthServiceProvider
    ) {

  }
logout(){
 this.authservice.logoutUser().then(() =>{
   this.navCtrl.setRoot(LoginPage);
 });
}

addSalon(){
  this.navCtrl.push(AddSalonPage);
}
}
