import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';

/**
 * Generated class for the AddStaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-staff',
  templateUrl: 'add-staff.html',
})
export class AddStaffPage {
  db = firebase.firestore();
  storage = firebase.storage().ref();

  Staff = {
    staffName: '',
    staffSurname: '',
    personalNumber: '',
    staffImage: '',
    uid: ''

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
  staffForm :FormGroup ;
  profileImage: string;
  uploadprogress;
  isuploading = false
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private formBuilder: FormBuilder) {

    this.staffForm = this.formBuilder.group({
      staffName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      staffSurname: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
   
    });
  }

  ionViewDidLoad() {
    this.getHairSalon();
  }
  async createStyle(staffForm: FormGroup): Promise<void> {
    if (!staffForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        staffForm.value
      );
    } else {
       
           const load = this.loadingCtrl.create({
            content: 'Creating HairSalon..'
          });
          load.present();

      let customStaffNumber = this.Staff.staffName +""+ 1000 + Math.floor(Math.random() * 10);    
      this.Staff.uid = customStaffNumber;
      const user = this.db.collection('SalonNode').doc(this.SalonNode.salonName).collection('Staff').doc(this.Staff.uid).set(this.Staff);
      // upon success...
      user.then( () => {
        this.navCtrl.setRoot(ManageHairSalonPage)
        this.toastCtrl.create({
          message: 'User hair dresser added.',
          duration: 2000,
       
        }).present();
        // ...get the profile that just got created...
        load.dismiss();
      
        // catch any errors.
      }).catch( err=> {
        this.toastCtrl.create({
          message: 'Error creating  hair dresser.',
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

      this.profileImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Salon-styles/' + this.authUser.getUser() + '.jpg';
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
          this.Staff.staffImage = downUrl;
          console.log('Image downUrl', downUrl);


        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })

  } 
  validation_messages = {
    'staffName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'staffSurname': [
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

  getHairSalon(){
 
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   
   let users = this.db.collection('SalonNode');
   
   let query = users.where("userUID", "==", this.authUser.getUser());
   query.get().then( snap => {
     
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
        
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

 goback(){
  this.navCtrl.pop();
}

}
