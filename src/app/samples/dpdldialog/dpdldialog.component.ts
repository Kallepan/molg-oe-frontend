import { Component, Inject } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-dpdldialog',
  templateUrl: './dpdldialog.component.html',
  styleUrls: ['./dpdldialog.component.scss']
})
export class DPDLDialogComponent {
  checkTagesnummer = (group: AbstractControl): ValidationErrors | null => {
    const tagesnummer = group.get('tagesnummer')?.value;
    const tagesnummerConfirm = group.get('tagesnummerConfirm')?.value;
    return tagesnummer === tagesnummerConfirm ? null : { notSame: true };
  };

  dpdplForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DPDLDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService
  ) { 
    const fb = new FormBuilder();

    const abstractControlOptions: AbstractControlOptions = {
      validators: this.checkTagesnummer
    };

    this.dpdplForm = fb.group({
      tagesnummer: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]],
      tagesnummerConfirm: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]],
    }, abstractControlOptions);
  }


  confirm() {
    if (this.dpdplForm.invalid) {
      this.messageService.handleFormError(this.dpdplForm);
      return;
    }

    const tagesnummer = this.dpdplForm.value.tagesnummer;
    this.dialogRef.close(tagesnummer);
  }

  abort() {
    this.dialogRef.close();
  }
}
