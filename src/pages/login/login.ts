import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateAccountPage } from '../create-account/create-account';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LandingPage } from '../landing/landing';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;
  hide='';
  constructor(public navCtrl: NavController, public navParams: NavParams,   private formBuilder: FormBuilder,
     private authservice: AuthServiceProvider,
     public loadingCtrl: LoadingController,
     public alertCtrl: AlertController) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }
  

  ionViewDidLoad() {
   
  }

  //Create 
  createAcc(){
this.navCtrl.push(CreateAccountPage)
  }
  forgotpassword(){
   this.showPrompt();
  }
  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        spinner: 'bubbles',
      });
    
      loading.present();
    
      setTimeout(() => {
        loading.dismiss();
      }, 5000);




      this.authservice.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authservice => {
        this.navCtrl.setRoot(LandingPage);
      }, error => {
        console.log(error.message)
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });

    }
  }
  goback(){
    this.navCtrl.pop()
  }
  inputEvent(data){

    if(data=='open'){
       this.hide='value'
    } else if(data=='close') {
      this.hide='';
    }
    
  }
  showPrompt() {
    const prompt = this.alertCtrl.create({
      title:'Reset Password',
      message: 'Enter your email so we can send the password reset link.',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.authservice.resetPassword(data.name1).then(
              async () => {
                const alert = await this.alertCtrl.create({
                  message: 'Check your email for a password reset link',
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {
                 
                          this.presentLoading()
                      }
                    }
                  ]
                });
                await alert.present();
              },
              async error => {
                const errorAlert = await this.alertCtrl.create({
                  message: error.message,
                  buttons: [{ text: 'Ok', role: 'cancel' }]
                });
                await errorAlert.present();
              }
            );
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2000
    });
    loader.present();
  }
}
