import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LandingPage } from '../landing/landing';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';


@IonicPage()
@Component({
  selector: 'page-addhair-style',
  templateUrl: 'addhair-style.html',
})
export class AddhairStylePage {

  profileImage = false
  storage = firebase.storage().ref();
  db = firebase.firestore();
  Gender : any = ['female','male'];
  Duration =  [{value:30, label:'30 minutes'},{value:60, label: '1 Hour'},{value:120, label: '2 Hours'},{value:180, label: '3 hours'}]
  addhairStyleForm : FormGroup;
styleImage
uploadprogress
isuploading: false;
hide='';
  Styles = {
    hairstyleName : '',
    hairstyleDesc : '',
    hairstylePrice : '',
    genderOptions: '',
    hairStyleImage: '',
    duration: 0,
    uid : ''
  }
  SalonNode = {
    salonName: '',
    salonImage: '',
    salonLogo: '',
    location: '',
    numHairDressers: '',
    SalonDesc: '',
    SalonContactNo: '',
    userUID: ''


  }
  long;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private authService: AuthServiceProvider
    ) {
    this.addhairStyleForm = this.formBuilder.group({
      hairstyleName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      hairstyleDesc: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])),
      hairstylePrice: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(4)])),
      genderOptions: [''],
      duration: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddhairStylePage');
    this.getHairSalon();
  }

  inputEvent(data){

    if(data=='open'){
       this.hide='value'
    } else if(data=='close') {
      this.hide='';
    }
    
  }
  

  
  async createStyle(addSalonForm: FormGroup): Promise<void> {
    if (!addSalonForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        addSalonForm.value
      );
    } else {
       
           const load = this.loadingCtrl.create({
            content: 'Creating Hairstyle..'
          });
          load.present();
      
      const user = this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('Styles').doc().set(this.Styles);
      // upon success...
      user.then( () => {
        this.navCtrl.pop()
        this.toastCtrl.create({
          message: 'User hairStyle added',
          duration: 2000,
       
        }).present();
        // ...get the profile that just got created...
        load.dismiss();
      
        // catch any errors.
      }).catch( err=> {
        this.toastCtrl.create({
          message: 'Error creating hairstyle.',
          duration: 2000
        }).present();
       
        load.dismiss();
      })
    }
  }

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

      this.styleImage = image;
      this.profileImage = true
      const filename = Math.floor(Date.now() / 1000);

      const randNumber = Math.floor(Math.random() * 50) + 1  
      let file = 'Salon-styles/' + this.authService.getUser() + filename + " " + randNumber +'.jpg';
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
          this.Styles.hairStyleImage = downUrl;
          console.log('Image downUrl', downUrl);


        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })

  } 

  validation_messages = {
    'hairstyleName': [
      { type: 'required', message: 'Hairstyle name is required.' },
      { type: 'minlength', message: 'Hairstyle Name must be at least 4 characters long.' },
      { type: 'maxlength', message: ' Hairstyle Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Hairstyle Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'hairstyleDesc': [
      { type: 'required', message: ' Hairstyle Description is required.' },
      { type: 'minlength', message: 'Hairstyle Description must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Hairstyle Description cannot be more than 50 characters long.' },
      { type: 'pattern', message: 'Your Hairstyle Description must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'hairstylePrice': [
      { type: 'required', message: 'Hairstyle price is required.' }
    ],
    'duration': [
      { type: 'required', message: 'duration is required.' }
    ],
  };

  getHairSalon(){
 
    let load = this.loadingCtrl.create({
     content: ' wait...',
     spinner: 'dots'
   });
   load.present();
   
   let users = this.db.collection('Salons');
   
   let query = users.where("userUID", "==", this.authService.getUser());
   query.get().then( snap => {
     
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
        
         this.SalonNode.salonName  = doc.data().salonName;
       })
     
     } else {
       console.log('No data');
     
     }
    
     load.dismiss();
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
     load.dismiss();
   })
 }
}
