import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map, Observable, Subject } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { PrintSample, Sample } from '../sample';
import { SampleAPIService } from '../sample-api.service';
import { AdditionalPrintDialogComponent } from './additional-print-dialog/additional-print-dialog.component';
import { ValidateSampleComponent } from '../validate-sample/validate-sample.component';
import { DPDLDialogComponent } from '../dpdldialog/dpdldialog.component';

@Component({
  selector: 'app-create-sample',
  templateUrl: './create-sample.component.html',
  styleUrls: ['./create-sample.component.scss'],
})
export class CreateSampleComponent implements OnInit, OnDestroy {
  sampleFormGroup: FormGroup;

  isError = false;

  noOfSamplesToDisplay = 12;

  private _samples$: Subject<Sample[]> = new Subject<Sample[]>();
  samples$: Observable<Sample[]> = this._samples$.asObservable().pipe(
    map(samples => {
      samples.forEach(sample => {
        sample.displaySampleId = sample.tagesnummer.slice(0, 2) + " " + sample.tagesnummer.slice(2, 6) + " " + sample.tagesnummer.slice(6, 10);
      });

      return samples;
    })
  );

  interval: any | undefined;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private sampleAPIService: SampleAPIService,
    private dialog: MatDialog,
  ) {
    const fb = new FormBuilder();

    this.sampleFormGroup = fb.group({
      tagesnummer: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]],
      assignRack: [false, []],
      print: [true, []]
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

    // Option to print another label
    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    const data: PrintSample = {
      tagesnummer: tagesnummer,
   };
    dialogConfig.data = data;

    this.dialog.open(AdditionalPrintDialogComponent, dialogConfig);
  }

  private _clearFormControls() {
    this.sampleFormGroup.controls["tagesnummer"].reset();
  }

  private _printLargeLabel(tagesnummer: string) {
    this.sampleAPIService.printLabel(tagesnummer, "largePrinter").subscribe({
      next: () => {

      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_PRINT);
      }
    });
  }

  private _printSmallLabel(tagesnummer: string) {
    this.sampleAPIService.printLabel(tagesnummer, "smallPrinter").subscribe({
      next: () => {

      },
      error: () => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_PRINT);
      }
    });
  }

  createDPDLSample() {
    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {};
    const print = this.sampleFormGroup.controls["print"].value;

    this.dialog.open(DPDLDialogComponent, dialogConfig).afterClosed().subscribe({
      next: (result) => {
        if (!result) return;

        this.sampleAPIService.postDPDLSample(result).subscribe({
          next: (resp) => {
            const internalNumber: string = resp.body.internal_number;

            this._copyInternalNumber(internalNumber);
            if (print) {
              this._printLargeLabel(result);
              this._printSmallLabel(result);
            }
          }, error: () => {
            this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
          }
        });
      },
    });

  }

  createDummySample() {
    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (confirm("Möchten Sie wirklich eine Dummy Probe anlegen?") === false) return;

    this.sampleAPIService.postDummySample().subscribe({
      next: (resp) => {
        const internalNumber: string = resp.body.internal_number;

        this._copyInternalNumber(internalNumber);
        this._updateSamples();
      }, error: () => {
        this._updateSamples();
        this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
      }
    });
  }

  createSample(event: Event) {
    event.preventDefault();

    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (!this.sampleFormGroup.valid) {
      this.messageService.handleFormError(this.sampleFormGroup);
      return;
    }

    const tagesnummer = this.sampleFormGroup.controls["tagesnummer"].value;
    const assignRack = this.sampleFormGroup.controls["assignRack"].value;
    const print = this.sampleFormGroup.controls["print"].value;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.autoFocus = true;
    const data = {
      originalSampleId: tagesnummer,
    }
    dialogConfig.data = data;

    this.dialog.open(ValidateSampleComponent, dialogConfig).afterClosed().subscribe(choice => {
      if (!choice) {
        this.messageService.simpleWarnMessage(ERRORS.VALIDATION_FAILED);
        return;
      }

      this.sampleAPIService.postSample(tagesnummer, assignRack).subscribe({
        next: (resp) => {
          const internalNumber: string = resp.body.internal_number;

          this._copyInternalNumber(internalNumber);
          if (print) {
            this._printLargeLabel(tagesnummer);
            this._printSmallLabel(tagesnummer);
          }
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
          this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
        }
      });
    });
  }


  ngOnInit() {
    this._updateSamples();

    this.interval = setInterval(() => {
      this._updateSamples();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
