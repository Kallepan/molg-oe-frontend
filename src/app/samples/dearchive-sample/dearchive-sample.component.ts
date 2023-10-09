import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { ValidateSampleComponent } from '../validate-sample/validate-sample.component';
import { SampleAPIService } from '../sample-api.service';

@Component({
  selector: 'app-dearchive-sample',
  templateUrl: './dearchive-sample.component.html',
  styleUrls: ['./dearchive-sample.component.scss']
})
export class DearchiveSampleComponent {
  private _messageService = inject(MessageService);
  private _authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private _sampleAPIService = inject(SampleAPIService);

  sampleFormGroup: FormGroup;
  private _dearchivedSamples = new BehaviorSubject<string[]>([]);
  dearchivedSamples$ = this._dearchivedSamples.asObservable();

  onSubmit(event: any) {
    event.preventDefault();

    if (!this._authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (this.sampleFormGroup.invalid) {
      this._messageService.handleFormError(this.sampleFormGroup);
      return;
    }

    const sampleId = this.sampleFormGroup.controls["sampleId"].value;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.autoFocus = true;
    const data = {
      originalSampleId: sampleId,
    }
    dialogConfig.data = data;


    this.dialog.open(ValidateSampleComponent, dialogConfig).afterClosed().subscribe(choice => {
      if (!choice) {
        this._messageService.simpleWarnMessage(ERRORS.VALIDATION_FAILED);
        return;
      }

      this._deleteSample(sampleId);
    });
  }
  
  private _deleteSample(sampleId: string) {
    if (confirm(`Möchten Sie die ${sampleId} wirklich aus dem Archiv entfernen?`) === false) return;

    this._sampleAPIService.dearchiveSample(sampleId).subscribe({
      next: () => {
        this._messageService.goodMessage("Probe erfolgreich gelöscht");
        this._dearchivedSamples.next([...this._dearchivedSamples.value, sampleId]);
      },
      error: () => {
        this._messageService.simpleWarnMessage(ERRORS.ERROR_NOT_DELETED);
      }
    });
  }

  constructor() {
    const fb = new FormBuilder();

    this.sampleFormGroup = fb.group({
      sampleId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]]
    });
  }
}
