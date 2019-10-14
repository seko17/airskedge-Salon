import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { LandingPage } from '../landing/landing';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LoginPage } from '../login/login';
import { OneSignal } from '@ionic-native/onesignal';



@IonicPage()
@Component({
  selector: 'page-salon-registrationpage',
  templateUrl: 'salon-registrationpage.html',
})
export class SalonRegistrationpagePage {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options={
   
   componentRestrictions: { country: 'ZA' }
   };
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid
  profileImage
  hide = ''
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  SalonOwnerProfile = {
    image: '',
    name: '',
    surname: '',
    personalNumber: null,
    About: '',
    uid: '',
date_created : null,
TokenID : ''
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private oneSignal: OneSignal) {

    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
this.SalonOwnerProfile.uid = this.uid

this.oneSignal.getIds().then((res) =>{
  this.SalonOwnerProfile.TokenID = res.userId;
})

    this.profileForm = this.formBuilder.group({
      name: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      surname: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      About: ['']
    });
    
  }

  ionViewDidLoad() {
    console.log('hai', this.uid)

    console.log('masibone', this.authUser.getUser())
  }
//   public handleAddressChange(addres: Address) {
//     // Do some stuff
//     console.log(addres);
//     this.SalonOwnerProfile.coords.lat = addres.geometry.location.lat() ;
//     this.SalonOwnerProfile.coords.lng =addres.geometry.location.lng() ;
// }
  //select image for the salon
  async selectImage() {
    let option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      this.profileImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Salon-Profile/' + this.authUser.getUser() + filename +'.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadprogress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.SalonOwnerProfile.image = downUrl;
          console.log('Image downUrl', downUrl);


        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })

  }
 async createprofile(profileForm: FormGroup): Promise<void> {
    if (!profileForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        profileForm.value
      );
    } else {
           // load the profile creation process
           const load = this.loadingCtrl.create({
            content: 'Creating Profile..'
          });
          load.present();
      this.SalonOwnerProfile.date_created = new Date();
      const user = this.db.collection('Users').doc(this.authUser.getUser()).update(this.SalonOwnerProfile);
      // upon success...
      user.then( () => {
        this.navCtrl.setRoot(LandingPage)
        this.toastCtrl.create({
          message: 'Welcome' ,
          duration: 2000,
       
        }).present();
        // ...get the profile that just got created...
        load.dismiss();
      
        // catch any errors.
      }).catch( err=> {
        this.toastCtrl.create({
          message: 'Error creating Profile.',
          duration: 2000
        }).present();
       
        load.dismiss();
      })
    }
  }
  inputEvent(data){

    if(data=='open'){
       this.hide='value'
    } else if(data=='close') {
      this.hide='';
    }
    
  }
  

 validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'surname': [
      { type: 'required', message: 'Surname is required.' },
      { type: 'minlength', message: 'Surname must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Surname cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Surname must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'personalNumber': [
      { type: 'required', message: 'Cellnumber is required.' }
    ],
    
  };
  signout(){
    this.authUser.logoutUser().then(()=>{
      this.navCtrl.setRoot(LoginPage)
    })
  }
  
}
