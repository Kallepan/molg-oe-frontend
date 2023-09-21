import { Component, HostBinding, OnInit } from '@angular/core';
import { CONSTANTS } from './config/constants';
import { AuthService } from './login/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = CONSTANTS.TITLE;
  version = CONSTANTS.VERSION;
  year = new Date().getFullYear();
  private _isDark: boolean;

  primaryNavLinks = CONSTANTS.NAV_LINKS.filter(navLink => navLink.primary).reverse();
  secondaryNavLinks = CONSTANTS.NAV_LINKS.filter(navLink => !navLink.primary)

  constructor(private authService: AuthService,
    private _overlayContainer: OverlayContainer,
    ) {
      // Check if dark mode is enabled in localStorage
      localStorage.getItem('darkMode') === 'true' ? this._isDark = true : this._isDark = false;
    }
  
    ngOnInit() {
      this.authService.setupLoginChecker();

      this._overlayContainer.getContainerElement().classList.add(this.themeMode);
    }
  
    @HostBinding('class')
    get themeMode() {
      return this._isDark ? 'theme-dark' : 'theme-light';
    }
  
    get isDark() {
      return this._isDark;
    }
  
    toggleTheme() {
      if (this._isDark) {
        this._overlayContainer.getContainerElement().classList.remove('theme-dark');
        this._overlayContainer.getContainerElement().classList.add('theme-light');
  
        // Save theme preference to localStorage
        localStorage.setItem('darkMode', 'false');
      }
      else {
        this._overlayContainer.getContainerElement().classList.remove('theme-light');
        this._overlayContainer.getContainerElement().classList.add('theme-dark');
        // Save theme preference to localStorage
        localStorage.setItem('darkMode', 'true');
      }
  
      this._isDark = !this._isDark;
    }
}
