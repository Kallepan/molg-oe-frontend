import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ERRORS } from 'src/app/config/errors.module';
import { MessageService } from 'src/app/services/message.service';
import { PrintSample } from '../../sample';
import { SampleAPIService } from '../../sample-api.service';


@Component({
  selector: 'app-additional-print-dialog',
  templateUrl: './additional-print-dialog.component.html',
  styleUrls: ['./additional-print-dialog.component.scss']
})
export class AdditionalPrintDialogComponent {
  private _tagesnummer : string;
  private _internalNumber: string;
  
  constructor(
    public dialogRef: MatDialogRef<AdditionalPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrintSample,
    private sampleAPIService: SampleAPIService,
    private messageService: MessageService) {

      this._internalNumber = data.internalNumber;
      this._tagesnummer = data.tagesnummer;

    }


  printLargeLabel() {
    this.sampleAPIService.printLabel(this._tagesnummer, this._internalNumber,"largePrinter").subscribe({
      next: () => {

      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_PRINT);
      }
    });
  }

  printSmallLabel() {
    this.sampleAPIService.printLabel(this._internalNumber, this._internalNumber, "smallPrinter").subscribe({
      next: () => {

      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_PRINT);
      }
    });
  }
}
