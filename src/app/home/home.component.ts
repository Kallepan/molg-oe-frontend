import { Component } from '@angular/core';
import { CONSTANTS } from '../config/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  navLinks = CONSTANTS.NAV_LINKS.reverse();
}
