import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewUserPorfilePage } from '../view-user-porfile/view-user-porfile';
import { AddhairStylePage } from '../addhair-style/addhair-style';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';


/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
db = firebase.firestore();
testArray = [];
saloninfo =[];
salonname;
userdata =this.userservice.userdata;
selecteddate;
validated =true;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userservice:UserProvider,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,) {
      console.log(this.userservice.userdata[0].uid)

     this.getsalonname();
 
   
  }
  obj ={};
  ionViewDidLoad() {
    
  }

getsalonname()
{
  firebase.firestore().collection('SalonNode').where("userUID","==",this.userservice.userdata[0].uid).get().then(val=>{
    val.forEach(uz=>{
      this.salonname =uz.data().salonName;
      this.gethairdresser(this.salonname )
      this.saloninfo.push(uz.data())
    });
  });

  
}


currentdate:Date;

  getHairSalon(){
    let load = this.loadingCtrl.create({
     content: 'Please wait...',
     spinner: 'dots'
   });
   load.present();
   this.testArray =[];
    this.db.collection('SalonNode').doc(this.salonname).collection('staff').doc(this.hairdresser).collection(this.userdate).get().then( snap => {
     if (snap.empty !== true){
       console.log('Got data', snap);
       snap.forEach(doc => {
        console.log('Profile Document: = ',doc.id, doc.data())
         
         let x1=new Date(doc.data().userdate) ;
         let x2=((new Date()).getFullYear()+'-'+(new Date().getMonth())+'-'+new Date().getDate());
       
       this.obj ={id:doc.id}
         this.testArray.push({...this.obj, ...doc.data()});
         console.log(this.testArray)
         //console.log("date1",x1)
         //console.log("date2",x2)
         if(x1.getMonth() ==(new Date().getMonth()) && (new Date().getDate()) ==x1.getDate() )
         {
this.validated =false;
//console.log("it worked = true")
         }
         else
         {
          this.validated =true;
          console.log("it worked =false")
         }
         
         console.log(this.obj)
        // this.staff.push(doc.data());
      
    console.log(this.staff)
       })
   
     } else {
       console.log('No data');

       const alert = this.alertCtrl.create({
        message: 'There are no bookings for '+this.hairdresser+' for '+this.userdate,
        buttons: ['OK']
      });
     alert.present();
     }
     load.dismiss();
   }).catch(err => {
    
     console.log("Query Results: ", err);
   
     load.dismiss();
   })
 }
 
 
 //Function to push to the user profile page
 ViewUserPorfilePage(){
   this.navCtrl.push(ViewUserPorfilePage);
 }
 //Function to push to adding a new hairstyle
 addStyle(){
   this.navCtrl.push(AddhairStylePage)
 }
 
 testarray;
events;
d1;
d2;
d3;


  staff =[];
  gethairdresser(x)
  {
   return this.db.collection('SalonNode').doc(this.salonname).collection('staff').get().then(val=>{
    val.forEach(stav=>{
      this.obj ={id:stav.id}
this.staff.push({...this.obj, ...stav.data()});
console.log(this.staff)
    })
  });

 
  }

hairdresser;
userdate;
  view()
  {

    console.log(this.hairdresser,this.userdate)
    this.getHairSalon()
  }
  cancelbooking:boolean;
  cancels(x)
  {
    console.log("This is user input =",x);

    

console.log(this.hairdresser,this.userdate)
  




    const prompt = this.alertCtrl.create({
      title: 'Cancel!',
      message: "Are you sure you want to cancel session with "+x.name+'?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            console.log('Cancel clicked');
           this.cancelbooking =true;


           firebase.firestore().collection('SalonNode').doc(x.salonname).collection('staff').doc(x.hairdresser).collection(x.userdate).doc(x.id).update({
            status2: 'cancelled'
            }).then(res=>{
            console.log(res)
            });

            firebase.firestore().collection('SalonNode').doc(x.salonname).collection('staff').doc(x.hairdresser).collection(x.userdate).doc(x.id).get().then(val=>{
              console.log(val.data())
            })




            
  let click = 1;
  let v1;
  let docid;
  
  firebase.firestore().collection('salonAnalytics').doc(x.salonuid).collection('numbers').get().then(val=>{
    console.log("These are the numbers",val)
    val.forEach(qu=> 
  
      {
      docid =qu.id;
      console.log(docid)
      console.log(qu.data().saloncancellations)
      v1 =qu.data().saloncancellations;
  
      firebase.firestore().collection('salonAnalytics').doc(x.salonuid).collection('numbers').doc(qu.id).update({"saloncancellations":v1+click}).then(zet=>{
        console.log(zet)
      })
      })

    })

            
            

          }
        },
        {
          text: 'No',
          handler: data => {
            console.log(data);
         this.cancelbooking =false;
         console.log(this.cancelbooking)

         
          }
        }
      ]
    });
    prompt.present();

   

/////////////////////////////////////////////////////////////

  }


  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  todate;
  onDaySelect(event)
  {
console.log(event);
event.year;
event.month;
event.date;

console.log(event.year,
  event.month,
  event.date)

  this.todate = (event.year)+'-'+(event.month)+'-'+(event.date);
  if((event.month+1)<10)
  {

    this.todate = (event.year)+'-0'+(event.month+1)+'-'+(event.date);
  if((event.date)<10)
  {
    this.todate = (event.year)+'-0'+(event.month+1)+'-0'+(event.date);
  }

}
this.userdate =this.todate;
console.log("Currentdate =",this.userdate)

  }
}




