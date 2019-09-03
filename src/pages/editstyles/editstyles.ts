import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
/**
 * Generated class for the EditstylesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editstyles',
  templateUrl: 'editstyles.html',
})
export class EditstylesPage {
  storage = firebase.storage().ref();
  db = firebase.firestore();
  Gender : any = ['female','male'];
  addhairStyleForm : FormGroup;
styleImage
uploadprogress
isuploading: false

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
  data = {} as Styles
  salonName
  salonm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private authService: AuthServiceProvider) {

this.data = this.navParams.data
console.log('check ',this.data.salonName);
console.log('check x2', this.data.hairstyleName);

      this.addhairStyleForm = this.formBuilder.group({
        hairstyleName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
        hairstyleDesc: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])),
        hairstylePrice: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(4)])),
        genderOptions: ['']
      });
  }

  ionViewDidLoad() {
  this.getHairSalon();
 
  
  }
  async createStyle(addSalonForm: FormGroup): Promise<void> {
    if (!addSalonForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        addSalonForm.value
      );
    } else {
       
           const load = this.loadingCtrl.create({
            content: 'Editing Hairstyle..'
          });
          load.present();
          
      const user = this.db.collection('SalonNode').doc(this.data.salonName).collection('Styles').doc(this.data.hairstyleName).update(this.data);
      user.then( () => {
        this.navCtrl.push(ManageHairSalonPage)
        this.toastCtrl.create({
          message: 'User Hairstyle edited.',
          duration: 2000,
        }).present();
        load.dismiss();
      }).catch( err=> {
        console.log(err);
        
        this.toastCtrl.create({
          message: 'Error editing Salon.',
          duration: 2000
        }).present();
        load.dismiss();
      })
    }
  }

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

      this.styleImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let load = this.loadingCtrl.create({
        content: 'Please wait....',
        duration: 5000
      })
      load.present();
      let file = 'Salon-styles/' + this.authService.getUser() + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadprogress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
        load.dismiss();
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {

          this.data.hairStyleImage = downUrl;
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
      { type: 'required', message: 'Cellnumber is required.' }
    ],
    
  };
  getHairSalon(){
 
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   
   let users = this.db.collection('SalonNode');
   
   let query = users.where("userUID", "==", this.authService.getUser());
   query.get().then( snap => {
     
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
        this.salonm = doc.data()
         this.SalonNode.salonName  = doc.data().salonName;
         this.SalonNode.salonLogo  = doc.data().salonLogo;
         this.SalonNode.salonImage  = doc.data().salonImage;
         this.SalonNode.numHairDressers  = doc.data().numHairDressers;
         this.SalonNode.location  = doc.data().location;
         this.SalonNode.SalonDesc  = doc.data().SalonDesc;
         this.SalonNode.SalonContactNo  = doc.data().SalonContactNo;
    
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
export interface Styles {
  hairstyleName : '',
  hairstyleDesc : '',
  hairstylePrice : '',
  genderOptions: '',
  hairStyleImage: '',
  uid : '',
  salonName : ''
}
