import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewReviewsPage } from './view-reviews';
import { StarRatingModule } from 'ionic3-star-rating';
@NgModule({
  declarations: [
    ViewReviewsPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(ViewReviewsPage),
  ],
})
export class ViewReviewsPageModule {}
