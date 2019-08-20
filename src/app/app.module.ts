import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserProvider } from '../providers/user/user';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { LoginPage } from '../pages/login/login';
import { SalonRegistrationpagePage } from '../pages/salon-registrationpage/salon-registrationpage';
import { UserCreateProfilePage } from '../pages/user-create-profile/user-create-profile';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { Camera } from "@ionic-native/camera";
import {  ImagePicker} from "@ionic-native/image-picker";
import { AddSalonPage } from '../pages/add-salon/add-salon';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreateAccountPage,
    LoginPage,
    SalonRegistrationpagePage,
    UserCreateProfilePage,
    ForgotPasswordPage,
    AddSalonPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CreateAccountPage,
    LoginPage,
    SalonRegistrationpagePage,
    UserCreateProfilePage,
    ForgotPasswordPage,
    AddSalonPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AuthServiceProvider,
     Camera,
     ImagePicker
  ]
})
export class AppModule {}
