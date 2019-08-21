import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageHairSalonPage } from './manage-hair-salon';

@NgModule({
  declarations: [
    ManageHairSalonPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageHairSalonPage),
  ],
})
export class ManageHairSalonPageModule {}
