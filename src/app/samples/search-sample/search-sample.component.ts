import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { PrintSample, Sample } from '../sample';
import { SampleAPIService } from '../sample-api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdditionalPrintDialogComponent } from '../create-sample/additional-print-dialog/additional-print-dialog.component';

@Component({
  selector: 'app-search-sample',
  templateUrl: './search-sample.component.html',
  styleUrls: ['./search-sample.component.scss']
})
export class SearchSampleComponent {
  sampleFormGroup: FormGroup;

  private _samplesSubject = new BehaviorSubject<Sample[]>([]);
  samples$: Observable<Sample[]> = this._samplesSubject.asObservable();

  isLoaded = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private sampleAPIService: SampleAPIService,
    private dialog: MatDialog,
  ) {
    const fb = new FormBuilder();

    this.sampleFormGroup = fb.group({
      tagesnummer: ['', []],
      internalNumber: ['', [Validators.pattern(/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{4}$/)]],
    });
  }


  private _appendSampleToSubject(sample: Sample | null) {
    if (!sample) {
      this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_SAMPLE);
      return;
    }
    
    const samples = this._samplesSubject.getValue();

    if(samples.filter(oldSample => sample.tagesnummer === oldSample.tagesnummer).length) {
      return;
    }

    samples.push(sample);

    this._samplesSubject.next(samples);
  }

  submitTagesnummer(event: Event) {
    event.preventDefault();

    if(!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;


    if (!this.sampleFormGroup.valid) {
      this.messageService.handleFormError(this.sampleFormGroup);
      return;
    }

    let tagesnummer: string = this.sampleFormGroup.controls["tagesnummer"].value;
    tagesnummer = tagesnummer.replace(/\s+/g, "");
    
    this.sampleAPIService.getSampleByTagesnummer(tagesnummer).subscribe({
      next: (resp) => {
        this.isLoaded = true;
        const sample: Sample| null = resp.body[0];

        this._appendSampleToSubject(sample);
      },
      error: (err) => {
        this.isLoaded = true;
        this.messageService.simpleWarnMessage(err.message)
      }
    });
  }

  submitInternalNumber(event: Event ) {
    event.preventDefault();

    if(!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (!this.sampleFormGroup.valid) {
      this.messageService.handleFormError(this.sampleFormGroup);
      return;
    }

    const internalNumber: string[] = this.sampleFormGroup.controls["internalNumber"].value.split("-")

    const sampelNo = internalNumber[0];
    const month = internalNumber[1];
    const year = internalNumber[2];

    this.sampleAPIService.getSampleByInternalNumber(sampelNo, month, year).subscribe({
      next: (resp) => {
        this.isLoaded = true;
        const sample: Sample| null = resp.body[0];

        this._appendSampleToSubject(sample);
      },
      error: (err) => {
        this.isLoaded = true;
        this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
      }
    });
  }

  printSample(sample: Sample) {
    // Option to print another label
    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    const data: PrintSample = {
      tagesnummer: sample.tagesnummer,
      internalNumber: sample.internal_number
    };
    dialogConfig.data = data;

    this.dialog.open(AdditionalPrintDialogComponent, dialogConfig);
  }

  private _printLargeLabel(tagesnummer: string, internal_number: string) {
    this.sampleAPIService.printLabel(tagesnummer, internal_number, "largePrinter").subscribe({
      next: () => {

      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_PRINT);
      }
    });
  }

  private _printSmallLabel(tagesnummer: string, internal_number: string) {
    this.sampleAPIService.printLabel(tagesnummer, internal_number, "smallPrinter").subscribe({
      next: () => {

      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_PRINT);
      }
    });
  }
}
