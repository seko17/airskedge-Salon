import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * Generated class for the StyleviewpopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'styleviewpopover',
  templateUrl: 'styleviewpopover.html'
})
export class StyleviewpopoverComponent {

  text: string;
data = {} as Styles
  constructor(public navParams: NavParams,) {
    console.log('Hello StyleviewpopoverComponent Component');
    this.text = 'Hello World';
this.data = this.navParams.data
console.log('yebo', this.data);

  }

}
export interface Styles {
  hairstyleName : '',
  hairstyleDesc : '',
  hairstylePrice : '',
  genderOptions: '',
  hairStyleImage: '',
  uid : ''
}
