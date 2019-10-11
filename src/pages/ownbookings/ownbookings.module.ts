import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnbookingsPage } from './ownbookings';

@NgModule({
  declarations: [
    OwnbookingsPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnbookingsPage),
  ],
})
export class OwnbookingsPageModule {}
