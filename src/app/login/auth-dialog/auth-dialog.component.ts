import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent {
  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    private authService: AuthService,) {
    const fb = new FormBuilder()
    this.loginFormGroup = fb.group({
      usernameControl: ['', [Validators.required, Validators.minLength(4)]],
      passwordControl: ['', [Validators.required]],
    });

    this.registerFormGroup = fb.group({
      usernameRegisterControl: ['', [Validators.required, Validators.minLength(4)]],
      newPasswordRegisterControl: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:;,.])[A-Za-z\d@$,!%*.:;?&]{8,}$/)]],
      firstNameControl: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
      lastNameControl: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
      emailControl: ['', [Validators.email, Validators.required]]
    })
  }

  submitRegister() {
    const username = this.registerFormGroup.controls["usernameRegisterControl"].value;
    const password = this.registerFormGroup.controls["newPasswordRegisterControl"].value;
    const first_name = this.registerFormGroup.controls["firstNameControl"].value.toLowerCase();
    const last_name = this.registerFormGroup.controls["lastNameControl"].value.toLowerCase();
    const email = this.registerFormGroup.controls["emailControl"].value.toLowerCase();

    const success = this.authService.register(username, password, first_name, last_name, email, this.dialogRef);
  }

  submitLogin() {
    const username = this.loginFormGroup.controls["usernameControl"].value;
    const password = this.loginFormGroup.controls["passwordControl"].value;
    this.authService.login(username, password, this.dialogRef);
  }
}
