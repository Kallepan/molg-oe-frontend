import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { Sample } from '../sample';
import { SampleAPIService } from '../sample-api.service';

@Component({
  selector: 'app-archive-sample',
  templateUrl: './archive-sample.component.html',
  styleUrls: ['./archive-sample.component.scss']
})
export class ArchiveSampleComponent implements OnInit {
  sampleFormGroup: FormGroup;

  noOfSamplesToDisplay = 36;
  isError = false;

  private _samples$: Subject<Sample[]> = new Subject<Sample[]>();
  samples$: Observable<Sample[]> = this._samples$.asObservable();

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
      }
    })
  }

  ngOnInit(): void {
    this._updateSamples()
  }

}
