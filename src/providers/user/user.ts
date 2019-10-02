import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
 Generated class for the UserProvider provider.
 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
*/
@Injectable()
export class UserProvider {
 userdata=[];
currentEvents =[];
db =firebase.firestore();
 constructor() {
 

  
      this.db.collection('Bookings').where("salonuid","==",firebase.auth().currentUser.uid).where("userdate",">=",this.cdate()).get().then( snap => {
       
         
          snap.forEach(doc => {
           console.log('data',doc.id, doc.data())
           
            
            let x1=new Date(doc.data().userdate) ;
         
          
      
   
            console.log("Manipulate this date",x1)
            this.currentEvents.push({year:x1.getFullYear(),month:x1.getMonth(),date:x1.getDate()})
            console.log(this.currentEvents)
            this.currentEvents =this.currentEvents;
          })})



 }



 cdate() {
  let todate;
 todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth()) + '-' + (new Date().getDate());
 if ((new Date().getMonth() + 1) < 10) {

 todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
   if ((new Date().getDate()) < 10) {
   todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
   }

 }
 else if ((new Date().getMonth() + 1) >= 10)
{
  todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());

  if ((new Date().getDate()) < 10) {
  todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
  }
}
 console.log("Currentdate =", todate)
 return todate;
}

}