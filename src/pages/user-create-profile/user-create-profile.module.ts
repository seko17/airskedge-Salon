import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCreateProfilePage } from './user-create-profile';

@NgModule({
  declarations: [
    UserCreateProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UserCreateProfilePage),
  ],
})
export class UserCreateProfilePageModule {}
