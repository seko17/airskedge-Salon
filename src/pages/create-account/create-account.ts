import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SalonRegistrationpagePage } from '../salon-registrationpage/salon-registrationpage';
import { LoginPage } from '../login/login';

/**
 * Generated class for the CreateAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {
  public signupForm: FormGroup;
  public loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authService: AuthServiceProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,) {
      this.signupForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: [
          '',
          Validators.compose([Validators.minLength(6), Validators.maxLength(15), Validators.required])
        ]
      });
  }

  ionViewDidLoad() {
   
  }
  async signupUser(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        signupForm.value
      );
    } else {
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;

      this.authService.signupUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {


            
          this.navCtrl.setRoot(SalonRegistrationpagePage)
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    }
  }

  signin(){
    this.navCtrl.push(LoginPage);
  }

  goback(){
    this.navCtrl.pop()
  }
}
