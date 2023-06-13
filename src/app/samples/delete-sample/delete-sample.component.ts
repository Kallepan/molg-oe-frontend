import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { SampleAPIService } from '../sample-api.service';
import { ValidateSampleComponent } from '../validate-sample/validate-sample.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-delete-sample',
  templateUrl: './delete-sample.component.html',
  styleUrls: ['./delete-sample.component.scss']
})
export class DeleteSampleComponent {
  sampleFormGroup: FormGroup;
  private _deletedSamples$ = new BehaviorSubject<string[]>([]); 
  deletedSamples$ = this._deletedSamples$.asObservable();

  onSubmit(event: any) {
    event.preventDefault();

    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (this.sampleFormGroup.invalid) {
      this.messageService.handleFormError(this.sampleFormGroup);
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
        this.messageService.simpleWarnMessage(ERRORS.VALIDATION_FAILED);
        return;
      }

      this._deleteSample(sampleId);
    });
  }

  private _deleteSample(sampleId: string) {
    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (confirm(`Möchten Sie die ${sampleId} wirklich löschen?`) === false) return;

    this.sampleAPIService.deleteSample(sampleId).subscribe({
      next: () => {
        this.messageService.goodMessage("Probe erfolgreich gelöscht");
        this._deletedSamples$.next([...this._deletedSamples$.value, sampleId]);
      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NOT_DELETED);
      }
    });
  }

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private sampleAPIService: SampleAPIService,
    private dialog: MatDialog
  ) { 
    const fb = new FormBuilder();

    this.sampleFormGroup = fb.group({
      sampleId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]]
    });
  }

}
