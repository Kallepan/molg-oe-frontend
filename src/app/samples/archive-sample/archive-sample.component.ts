import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { Sample } from '../sample';
import { SampleAPIService } from '../sample-api.service';
import { ColumnsSchema } from 'src/app/shared/samples-table/samples-table.component';

@Component({
  selector: 'app-archive-sample',
  templateUrl: './archive-sample.component.html',
  styleUrls: ['./archive-sample.component.scss']
})
export class ArchiveSampleComponent implements OnInit, OnDestroy {
  sampleFormGroup: FormGroup;

  noOfSamplesToDisplay = 36;
  isError = false;

  private _timerSubject = new Subject<void>();
  private _timerSubscription: any | undefined;
  private _setupTimer() {
    this._timerSubscription = this._timerSubject.pipe(
      debounceTime(2500),
      distinctUntilChanged(),
      switchMap(() => {
        this.archivedSample = false;
        return new Observable<void>();
      }),
    ).subscribe();
  }

  private _samples$: Subject<Sample[]> = new Subject<Sample[]>();
  samples$: Observable<Sample[]> = this._samples$.asObservable();
  
  interval: any | undefined;
  displayedColumns = [
    'displaySampleId',
    'internalID',
    'created_at',
    'created_by',
    'position',
  ];

  archivedSample: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private sampleAPIService: SampleAPIService
  ) {
    const fb = new FormBuilder();
    this.sampleFormGroup = fb.group({
      tagesnummer: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(12)]]
    });
  }

  private _clearFormControls() {
    this.sampleFormGroup.reset();
  }

  private _updateSamples() {
    this.sampleAPIService.getLatestSamplesByArchive(this.noOfSamplesToDisplay).subscribe({
      next: (resp) => {
        if (!resp.body.results.length) {
          return;
        }

        const samples: Sample[] = resp.body.results;
        const formattedSamples = samples.map(sample => {
          sample.archived = sample.archived_at != "NA";
          sample.displaySampleId = sample.tagesnummer.slice(0, 4) + " " + sample.tagesnummer.slice(4, 10);  
          return sample;
        });
        
        this._samples$.next(formattedSamples);
      },
      error: () => {
        this.isError = true;
      }
    });
  }

  submit(event: Event) {
    event.preventDefault();

    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;

    if (!this.sampleFormGroup.valid) {
      this.messageService.handleFormError(this.sampleFormGroup);
    }

    const tagesnummer = this.sampleFormGroup.controls["tagesnummer"].value;

    this.sampleAPIService.assignRackPosition(tagesnummer).subscribe({
      next: (resp) => {
        this._updateSamples();
        this._clearFormControls();

        this.archivedSample = true;
        this._timerSubject.next();
      },
      error: (err) => {
        if (err.status === 404) {
          this.messageService.simpleWarnMessage(ERRORS.ERROR_NO_SAMPLE);
          return;
        }
        const messages: string[] | undefined = err.error?.assign_rack;
        if (messages) {
          const outputMessage = messages.reduce(
            (acc, cur) => acc + cur + ".", ""
          );
          this.messageService.simpleWarnMessage(outputMessage);
          return;
        }

        this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
      }
    })
  }

  ngOnInit(): void {    
    this._updateSamples();
    this.interval = setInterval(() => {
      this._updateSamples();
    }, 10000);

    this._setupTimer();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this._timerSubscription?.unsubscribe();
  }
}
