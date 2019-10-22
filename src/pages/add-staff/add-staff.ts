import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import firebase from 'firebase';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { ManageHairSalonPage } from '../manage-hair-salon/manage-hair-salon';
import { ManageStaffPage } from '../manage-staff/manage-staff';
​
/**
 * Generated class for the AddStaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
​
@IonicPage()
@Component({
  selector: 'page-add-staff',
  templateUrl: 'add-staff.html',
})
export class AddStaffPage {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  SalonCoverImage =  false;
  hide='';
  Staff = {
    name: '',
    personalNumber: '',
    staffImage: '',
    uid: '',
    date_created: null,
    isAvialiabe: true,
​staffSurname: '',
specialisation:''
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
​
​
  }
  win
  loaderAnimate = true
  specialisation =  [{value:'male', label:'Male Hairstyles'},{value:'female', label: 'Female Hairstyles'},{value:'both', label: 'Both Male & Female Hairstyles'}]
  staffForm :FormGroup ;
  profileImage: string;
  uploadprogress;
  isuploading = false
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private formBuilder: FormBuilder,public actionSheetCtrl: ActionSheetController) {

    this.staffForm = this.formBuilder.group({
      name: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      staffSurname: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      special : new FormControl()
    });
  }
​
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
            content: 'Creating staff member..'
          });
          load.present();
​
      // let customStaffNumber = this.Staff.name +""+ 1000 + Math.floor(Math.random() * 10);    
      this.Staff.uid = this.Staff.name +''+this.Staff.staffSurname;
      this.Staff.date_created = new Date();
      const user = this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('staff').doc().set(this.Staff);
      // upon success...
      user.then( () => {
        this.navCtrl.pop()
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
​async selectImage() {

  const actionSheet = await this.actionSheetCtrl.create({
      title: "Select Image source",
      cssClass: 'myPage',
      buttons: [{
        icon: 'image',
        text: 'Photo Gallery',
              handler: () => {
                this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
              }
          },
          {
            icon: 'camera',
            text: 'Take Picture',
              handler: () => {
                  this.takePicture(this.camera.PictureSourceType.CAMERA);
              }
          },
          {
            icon: 'close',
            text: 'Cancel',
            role: 'cancel',
          }
      ]
  });
  await actionSheet.present(); 
  }
  async takePicture(sourceType: PictureSourceType) {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 90,
      targetHeight : 600,
      targetWidth : 600,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
  // this.camera.getPicture(options)
  // .then((imageData) => {
  //   // do something with the imageData, should be able to bind it to a variable and 
  //   // show it in your html file. You might need to fix file path, 
  //   // remember to import private win: any = window, and use it like this.

  //   this.profileImage = this.win.Ionic.WebView.convertFileSrc(imageData);

  // }).catch((err) => {
  //   console.warn("takePicture Error: " + err);
  // });
    await this.camera.getPicture(options).then(res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
​
      this.profileImage = image;
      
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Salon-staff/' + this.authUser.getUser() + filename +  '.jpg';
      const UserImage = this.storage.child(file);
​
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
​
​
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
​
  } 
  validation_messages = {
    'name': [
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
​
  getHairSalon(){ 
   let users = this.db.collection('Salons');
   
   let query = users.where("userUID", "==", this.authUser.getUser());
   query.get().then( snap => {
     
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
         console.log('Profile Document: ', doc.data())
        
         this.SalonNode.salonName  = doc.data().salonName;

    
       })
     this.loaderAnimate =false
     } else {
       console.log('No data');
     
     }
    
    
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
    
   })
 }
​
 goback(){
  this.navCtrl.pop();
}

inputEvent(data){

  if(data=='open'){
     this.hide='value'
  } else if(data=='close') {
    this.hide='';
  }
  
}
​
}



