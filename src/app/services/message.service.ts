import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

const SHORT_TIME_TILL_DISAPPEARANCE = 2000;
const LONG_TIME_TILL_DISAPPEARANCE = 10000;

const CONFIRM_ACTION = "Okay";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

  simpleWarnMessage(userMessage: string) {
    this._snackbar.open(userMessage, CONFIRM_ACTION, {
      duration: LONG_TIME_TILL_DISAPPEARANCE,
      panelClass: ['warn-snackbar'],
    })
  }

  handleFormError(formGroup: FormGroup) {
    let error_message = "";
    Object.keys(formGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = formGroup.controls[key].errors;
      if (controlErrors != null) {
        error_message = error_message + capitalize(key) + ": ";
        Object.keys(controlErrors).forEach(keyError => {
          switch (keyError) {
            case 'minlength':
              error_message = error_message + `Erforderliche Mindestlaenge: ${controlErrors[keyError].requiredLength}. `
              break;
            case 'maxlength':
              error_message = error_message + `Erforderliche Maximallaenge: ${controlErrors[keyError].requiredLength}. `
              break;
            case 'pattern':
              error_message = error_message + `Pattern ungueltig. `
              break;
            case 'required':
              error_message = error_message + `Das Feld darf nicht leer sein. `
              break;
            case 'notSame':
              error_message = error_message + `Die beiden Felder muessen gleich sein. `
              break;
            default:
              error_message = error_message + `Unbekannter Fehler. `
              break;
          }
        });
      }
    });

    this.simpleWarnMessage(error_message);
  }
}
