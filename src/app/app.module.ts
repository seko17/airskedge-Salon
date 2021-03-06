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
//import { CalendarModule } from 'ionic3-calendar';
import { Camera } from "@ionic-native/camera";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ImagePicker } from "@ionic-native/image-picker";
import { AddSalonPage } from '../pages/add-salon/add-salon';
import { LandingPage } from '../pages/landing/landing';
import { ManageHairSalonPage } from '../pages/manage-hair-salon/manage-hair-salon';
import { ViewUserPorfilePage } from '../pages/view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../pages/addhair-style/addhair-style';
import { StyleviewpopoverComponent } from '../components/styleviewpopover/styleviewpopover';
import { EditstylesPage } from '../pages/editstyles/editstyles';
import { ManageStaffPage } from '../pages/manage-staff/manage-staff';
import { AddStaffPage } from '../pages/add-staff/add-staff';
import { BookingsPage } from '../pages/bookings/bookings';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { CalendarModule } from 'ionic3-calendar-en';
import { ViewReviewsPage } from '../pages/view-reviews/view-reviews';
import { AnalysisPage } from '../pages/analysis/analysis';
import { StarRatingModule } from 'ionic3-star-rating';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ViewStaffProfilePage } from '../pages/view-staff-profile/view-staff-profile';
import { OneSignal } from '@ionic-native/onesignal';
import { SMS } from '@ionic-native/sms';
import { OwnbookingsPage } from '../pages/ownbookings/ownbookings';
import { IonicStorageModule } from '@ionic/storage';
import { PagesPage } from '../pages/pages/pages';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreateAccountPage,
    LoginPage,
    SalonRegistrationpagePage,
    UserCreateProfilePage,
    ForgotPasswordPage,
    AddSalonPage,
    LandingPage,
    ManageHairSalonPage,
    ViewUserPorfilePage,
    AddhairStylePage,
    StyleviewpopoverComponent,
    EditstylesPage,
    ManageStaffPage,
    AddStaffPage,
    BookingsPage,
    ViewReviewsPage,
    AnalysisPage,
    EditProfilePage,
    ViewStaffProfilePage,
    OwnbookingsPage,
    PagesPage
  ],
  imports: [
    BrowserModule,
    CalendarModule,
    IonicStorageModule.forRoot(),
    StarRatingModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: true,
      scrollAssist: false,
     
      
    }),
    ReactiveFormsModule,
    FormsModule,
    
    GooglePlaceModule,
    // ScreenOrientation

    
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
    AddSalonPage,
    LandingPage,
    ManageHairSalonPage,
    ViewUserPorfilePage,
    AddhairStylePage,
    StyleviewpopoverComponent,
    EditstylesPage,
    ManageStaffPage,
    AddStaffPage,
    BookingsPage,
    ViewReviewsPage,
    AnalysisPage,
    EditProfilePage,
    ViewStaffProfilePage,
    OwnbookingsPage,
    PagesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AuthServiceProvider,
    ScreenOrientation,
     Camera,
     ImagePicker,
     SMS,
     NativeGeocoder, LocalNotifications
  ]
})
export class AppModule {}
