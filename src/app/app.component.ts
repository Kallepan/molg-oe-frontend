import { Component, HostBinding, OnInit } from '@angular/core';
import { CONSTANTS } from './config/constants';
import { AuthService } from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = CONSTANTS.TITLE;
  version = CONSTANTS.VERSION;
  year = new Date().getFullYear();
  isDark = true;

  primaryNavLinks = CONSTANTS.NAV_LINKS.filter(navLink => navLink.primary).reverse();
  secondaryNavLinks = CONSTANTS.NAV_LINKS.filter(navLink => !navLink.primary)

  constructor(private authService: AuthService) {  }

  ngOnInit(): void {
    this.authService.setupLoginChecker();
  }

  @HostBinding('class')
  get themeMode() {
    return this.isDark ? '' : 'theme-light';
  }
}
