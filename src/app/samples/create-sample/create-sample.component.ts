import { DialogRef } from '@angular/cdk/dialog';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { PrintSample, Sample } from '../sample';
import { SampleAPIService } from '../sample-api.service';
import { AdditionalPrintDialogComponent } from './additional-print-dialog/additional-print-dialog.component';

@Component({
  selector: 'app-create-sample',
  templateUrl: './create-sample.component.html',
  styleUrls: ['./create-sample.component.scss'],
})
export class CreateSampleComponent implements OnInit {
  sampleFormGroup: FormGroup;

  isError = false;

  noOfSamplesToDisplay = 36;

  private _samples$: Subject<Sample[]> = new Subject<Sample[]>();
  samples$: Observable<Sample[]> = this._samples$.asObservable();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private sampleAPIService: SampleAPIService,
    private dialog: MatDialog,
  ) {
    const fb = new FormBuilder();

    this.sampleFormGroup = fb.group({
      tagesnummer: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]],
      assignRack: [false, []]
    })
  }

  private _updateSamples() {
    this.sampleAPIService.getLatestSamples(this.noOfSamplesToDisplay).subscribe({
      next: (resp) => {
        if (!resp.body.results.length) {
          return;
        }
        const samples: Sample[] = resp.body.results;
        const formattedSamples = samples.map(sample => {
          sample.archived = sample.archived_at != "NA";
          return sample;
        });
        this._samples$.next(formattedSamples);
      },
      error: () => {
        this.isError = true;
      }
    });
  }

  ngOnInit() {
    this._updateSamples();
  }

  private _copyInternalNumber(internalNumber: string) {
    if (!window.isSecureContext) {
      this.messageService.simpleWarnMessage("Kopieren ins Clipboard ist aufgrund der unsicheren Umgebung abgeschaltet.");
      return;
    }

    navigator.clipboard.writeText(internalNumber);
    this.messageService.goodMessage(`${internalNumber} wurde ins Clipboard kopiert.`);
  }

  onSampleClick(tagesnummer: string, internalNumber: string) {
    if (!window.isSecureContext) {
      this.messageService.simpleWarnMessage("Kopieren ins Clipboard ist aufgrund der unsicheren Umgebung abgeschaltet.");
      return;
    }
    
    navigator.clipboard.writeText(internalNumber);
    this.messageService.goodMessage(`${internalNumber} wurde ins Clipboard kopiert.`);

    const dialogConfig =  new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    const data: PrintSample = {
      tagesnummer: tagesnummer,
      internalNumber: internalNumber
    };
    dialogConfig.data = data;

    //TODO this.dialog.open(AdditionalPrintDialogComponent, dialogConfig);
  }

  private _clearFormControls() {
    this.sampleFormGroup.controls["tagesnummer"].reset();
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

  submit(event: Event) {
    event.preventDefault();

    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (!this.sampleFormGroup.valid) {
      this.messageService.handleFormError(this.sampleFormGroup);
      return;
    }

    const tagesnummer = this.sampleFormGroup.controls["tagesnummer"].value;
    const assignRack = this.sampleFormGroup.controls["assignRack"].value;

    this.sampleAPIService.postSample(tagesnummer, assignRack).subscribe({
      next: (resp) => {
        const internalNumber: string = resp.body.internal_number;
        
        this._copyInternalNumber(internalNumber);
        //TODO this._printLargeLabel(tagesnummer, internalNumber);
        //TODO this._printSmallLabel(tagesnummer, internalNumber);
        this._updateSamples();
        this._clearFormControls();
      },
      error: (err) => {
        const messages: string[] | undefined = err.error?.tagesnummer;
        if (messages) {
          const outputMessage = messages.reduce(
            (acc, cur) => acc + cur + "", ""
          );
          this.messageService.simpleWarnMessage(outputMessage);
          return;
        }
        this.messageService.warnMessage(ERRORS.ERROR_API, err);
      }
    });
  }
}
