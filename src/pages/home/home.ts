
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
  show = true;
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

skip(){
  this.navCtrl.setRoot(LoginPage);
  console.log('clicked');
  
}


register(){
  this.navCtrl.setRoot(CreateAccountPage);
}

nextslides(){
  this.slides.lockSwipes(false)
  this.slides.slideNext();
  if(this.slides._activeIndex == 2){
    console.log('index',this.slides._activeIndex);
    
      this.show = false;
  }
  
}
}
