import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddhairStylePage } from './addhair-style';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddhairStylePage,
  ],
  imports: [
    IonicPageModule.forChild(AddhairStylePage),
    ReactiveFormsModule
  ],
})
export class AddhairStylePageModule {}
