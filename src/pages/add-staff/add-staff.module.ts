import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddStaffPage } from './add-staff';

@NgModule({
  declarations: [
    AddStaffPage,
  ],
  imports: [
    IonicPageModule.forChild(AddStaffPage),
  ],
})
export class AddStaffPageModule {}
