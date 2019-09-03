import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSalonPage } from './add-salon';

@NgModule({
  declarations: [
    AddSalonPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSalonPage),
  ],
})
export class AddSalonPageModule {}
