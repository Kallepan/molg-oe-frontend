import { Component } from '@angular/core';
import { CONSTANTS } from '../config/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  primaryNavLinks = CONSTANTS.NAV_LINKS.filter(link => link.primary);
  secondaryNavLinks = CONSTANTS.NAV_LINKS.filter(link => !link.primary);

}
