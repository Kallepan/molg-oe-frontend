import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ERRORS } from 'src/app/config/errors.module';
import { MessageService } from 'src/app/services/message.service';

type ColorEncoding = {
  char: string,
  color: string
}

@Component({
  selector: 'app-validate-sample',
  templateUrl: './validate-sample.component.html',
  styleUrls: ['./validate-sample.component.scss']
})
export class ValidateSampleComponent {
  originalSampleId: string;

  validationFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ValidateSampleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _messageService: MessageService
  ) {
    const fb = new FormBuilder();
    this.validationFormGroup = fb.group({
      copySampleId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]],
    });
    if (!data.originalSampleId) {
      this.dialogRef.close(null);
      return;
    }
    this.originalSampleId = data.originalSampleId;
  }

  getScannedNumber(): string {
    return this.validationFormGroup.valid? this.validationFormGroup.value.copySampleId : 'NA';
  }

  confirm() {
    if (this.validationFormGroup.invalid) {
      this._messageService.simpleWarnMessage(ERRORS.INVALID_TAGESNUMMER);
      return;
    }

    if (this.validationFormGroup.value.copySampleId !== this.originalSampleId) {
      this._messageService.simpleWarnMessage('Die Tagesnummer stimmt nicht überein!');
      return;
    }

    this.dialogRef.close(this.validationFormGroup.value.copySampleId);
  }

  getColorEncoding(): Array<ColorEncoding> {
    if (this.validationFormGroup.invalid) {
      return [];
    }

    const copySampleId: string = this.validationFormGroup.value.copySampleId;
    const encoding = copySampleId.split('').map((char, index) => {
      if (char === this.originalSampleId[index]) {
        return { char, color: "#00ff00" };
      } else {
        return { char, color: "#ff0000" };
      }
    });

    return encoding;
  }
}
