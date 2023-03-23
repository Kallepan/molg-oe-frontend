import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CONSTANTS } from '../config/constants';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {  }

  isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  getUsername() {
    return localStorage.getItem(CONSTANTS.JWT_USERNAME_STORAGE);
  }

  openAuthDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    
    this.dialog.open(AuthDialogComponent, dialogConfig);
  }
}