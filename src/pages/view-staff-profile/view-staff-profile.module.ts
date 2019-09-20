import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewStaffProfilePage } from './view-staff-profile';

@NgModule({
  declarations: [
    ViewStaffProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewStaffProfilePage),
  ],
})
export class ViewStaffProfilePageModule {}
