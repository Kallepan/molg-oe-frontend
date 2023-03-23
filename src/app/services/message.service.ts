import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomError } from '../config/constants';

const SHORT_TIME_TILL_DISAPPEARANCE = 2000;
const LONG_TIME_TILL_DISAPPEARANCE = 10000;

const CONFIRM_ACTION = "Okay";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private _snackbar: MatSnackBar) { }

  goodMessage(message: string) {
    this._snackbar.open(message, CONFIRM_ACTION, {
      duration: SHORT_TIME_TILL_DISAPPEARANCE,
      panelClass: ['success-snackbar']
    })
  }

  warnMessage(userMessage: string, programmingMessage: CustomError) {
    const message = userMessage + ". " + programmingMessage.message;
    this._snackbar.open(message, CONFIRM_ACTION, {
      duration: LONG_TIME_TILL_DISAPPEARANCE,
      panelClass: ["warn-snackbar"],
    });
  }

  simpleWarnMessage(userMessage: string) {
    this._snackbar.open(userMessage + ".", CONFIRM_ACTION, {
      duration: LONG_TIME_TILL_DISAPPEARANCE,
      panelClass: ['warn-snackbar'],
    })
  }

  displayFormErrors(formGroup: FormGroup) {
    let error_message = "";
    Object.keys(formGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = formGroup.controls[key].errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          error_message = error_message + key + ": " + keyError + "; ";
        });
      }
    });

    this.simpleWarnMessage(error_message);
  }
}
