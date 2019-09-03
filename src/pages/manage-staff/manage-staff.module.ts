import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageStaffPage } from './manage-staff';

@NgModule({
  declarations: [
    ManageStaffPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageStaffPage),
  ],
})
export class ManageStaffPageModule {}
