import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LandingPage } from '../landing/landing';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult
} from '@ionic-native/native-geocoder';
import { OneSignal } from '@ionic-native/onesignal';

/**
 * Generated class for the AddSalonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-salon',
  templateUrl: 'add-salon.html',
})
export class AddSalonPage {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  options = {

    componentRestrictions: { country: 'ZA' }
  };
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid

  uploadprogress = 0;
  isuploading: false
  addSalonForm: FormGroup;
  SalonCoverImage;
  SalonLogoImage;
  hide='';
  SalonNode = {
    salonName: '',
    salonImage: '',
    numHairDressers: '',
    SalonDesc: '',
    SalonContactNo: '',
    userUID: '',
    Address: {
      lat: 0,
      lng: 0,
      streetName: '',
      fullAddress: ''
    },
    DatCreated: null,
    Metro: '',
    Metro2 : '',
    TokenID: '',
    openTime: '',
    closeTime: ''

  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private GEOCODE: NativeGeocoder,
    private formBuilder: FormBuilder,
    private oneSignal: OneSignal) {

    //get logged user uid and set the uid
    this.uid = firebase.auth().currentUser.uid;
    this.authService.setUser(this.uid);

    //set user uid
    this.SalonNode.userUID = this.uid;
    //get user Token ID
    this.oneSignal.getIds().then((res) => {
      this.SalonNode.TokenID = res.userId;
    })
    //form builder validations
    this.addSalonForm = this.formBuilder.group({
      salonName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      // location: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
      SalonContactNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      SalonDesc: [''],
      numHairDressers: [''],
      openTime: new FormControl('', Validators.compose([Validators.required])),
      closeTime: new FormControl('', Validators.compose([Validators.required])),
    });

  }
  public handleAddressChange(addres: Address) {
    // Do some stuff
    console.log(addres);

    this.SalonNode.Address.lat = addres.geometry.location.lat();
    this.SalonNode.Address.lng = addres.geometry.location.lng();
    this.SalonNode.Address.fullAddress = addres.formatted_address;
    this.SalonNode.Address.streetName = addres.name;
     this.SalonNode.Metro2 = addres.address_components[3].short_name ;
    this.SalonNode.Metro = addres.address_components[4].short_name;
    console.log('hlleeoeoe', addres.address_components[4].short_name)


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSalonPage');
  }


  inputEvent(data){

    if(data=='open'){
       this.hide='value'
    } else if(data=='close') {
      this.hide='';
    }
    
  }
  //function to store the salon on the database

  async createSalon(addSalonForm: FormGroup): Promise<void> {
    if (!addSalonForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        addSalonForm.value
      );
    } else {
      // load the profile creation process
      const load = this.loadingCtrl.create({
        content: 'Creating Salon..'
      });
      load.present();
      this.SalonNode.DatCreated = new Date();
      parseInt(this.SalonNode.SalonContactNo)
      const user = this.db.collection('Salons').doc(firebase.auth().currentUser.uid).set(this.SalonNode)
      this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('Analytics').add({
        likes: [],
        SalonCancellations: 0,
        UserCancellations: 0,
        AllBookings: 0,
        NumberOfViews: 0

      })
      // upon success...
      user.then(() => {
        this.navCtrl.setRoot(LandingPage)
        this.toastCtrl.create({
          message: 'User Salon added.',
          duration: 2000,

        }).present();
        // ...get the profile that just got created...
        load.dismiss();

        // catch any errors.
      }).catch(err => {
        this.toastCtrl.create({
          message: 'Error creating Salon.',
          duration: 2000
        }).present();

        load.dismiss();
      })
    }
  }


  //select cover image for the salon 
  async selectImage() {
    let option: CameraOptions = {
    
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 90,
      targetHeight : 600,
      targetWidth : 600,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      this.SalonCoverImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Salon-cover-image/' + this.authService.getUser() + filename + '.jpg';
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
          this.SalonNode.salonImage = downUrl;
          console.log('Image downUrl', downUrl);


        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })

  }
  // Validation messages
  validation_messages = {
    'salonName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'location': [
      { type: 'required', message: 'location is required.' },
      { type: 'minlength', message: 'location must be at least 4 characters long.' },
      { type: 'maxlength', message: 'location cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your location must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your location has already been taken.' }
    ],
    'SalonContactNo': [
      { type: 'required', message: 'Salon contact number is required.' }
    ],
    'numHairDressers': [
      { type: 'required', message: 'Number of hairdresses is required.' }
    ],
    'openTime': [
      { type: 'required', message: 'Salon opening time is required.' }
    ],
    'closeTime': [
      { type: 'required', message: 'Salon closing time is required.' }
    ],
  };

}
