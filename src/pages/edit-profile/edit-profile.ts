import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  SalonOwnerProfile = {} as user
  profileImage
  uid
  email
  loaderAnimate = true
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private formBuilder: FormBuilder) {
      setTimeout(()=>{
        this.loaderAnimate = false
        },2000)
    
      
      let users = this.db.collection('Users');
  
      let query = users.where("uid", "==", this.authUser.getUser());
      query.get().then(querySnapshot => {
      
        if (querySnapshot.empty !== true){
          console.log('Got data', querySnapshot);
          querySnapshot.forEach(doc => {
            console.log('Profile Document: ', doc.data())
        
            this.SalonOwnerProfile.About = doc.data().About;
            this.SalonOwnerProfile.image = doc.data().image;
            this.profileImage = doc.data().image;
            console.log( this.profileImage);
            this.SalonOwnerProfile.name = doc.data().surname;
            this.SalonOwnerProfile.surname = doc.data().name;
            this.SalonOwnerProfile.personalNumber = doc.data().personalNumber;
            this.SalonOwnerProfile.email = doc.data().email;
            // this.SalonOwnerProfile.coords.lat = doc.data().lat
          
          })
       
        } else {
          console.log('No data');
        
        }
    
      }).catch(err => {
        // catch any errors that occur with the query.
        console.log("Query Results: ", err);
      })
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
this.SalonOwnerProfile.uid = this.uid

    this.profileForm = this.formBuilder.group({
      name: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      surname: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      About: ['']
    });
    
  }

  ionViewDidLoad() {

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
            content: 'Updating Profile..'
          });
          load.present();
      
      const user = this.db.collection('Users').doc(this.authUser.getUser()).set(this.SalonOwnerProfile);
      // upon success...
      user.then( () => {
        this.navCtrl.setRoot(ViewUserPorfilePage)
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
    'phone': [
      { type: 'required', message: 'Cellnumber is required.' }
    ],
    
  };
  signout(){
    this.navCtrl.setRoot(ViewUserPorfilePage)
  }
}
export interface user {
  image: string,
  name: string,
  surname: string,
  personalNumber: null, 
  About: string,
  uid: string,
  email : string
}