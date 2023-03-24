import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { SampleAPIService } from '../sample-api.service';

export interface  Sample {
  created_by: string,
  created_at: string,
  tagesnummer: string,
  full_rack_position: string,
  internal_number: string,
}

@Component({
  selector: 'app-create-sample',
  templateUrl: './create-sample.component.html',
  styleUrls: ['./create-sample.component.scss']
})
export class CreateSampleComponent implements OnInit {
  sampleFormGroup: FormGroup;

  isError = false;

  noOfSamplesToDisplay = 10;

  private _samples$: Subject<Sample[]> = new Subject<Sample[]>();
  samples$: Observable<Sample[]> = this._samples$.asObservable();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private sampleAPIService: SampleAPIService
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
        this._samples$.next(samples);
      },
      error: () => {
        this.isError = true;
      }
    });
  }

  ngOnInit() {
    this._updateSamples();
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
        console.log(resp) // TODO Copy to clipboard
        const internalNumber: string = resp.body.internal_number;
        if (window.isSecureContext) {
          navigator.clipboard.writeText(internalNumber);
          this.messageService.goodMessage(`${internalNumber} wurde ins Clipboard kopiert.`)
        } else {
          this.messageService.simpleWarnMessage("Kopieren ins Clipboard ist aufgrund der unsicheren Umgebung abgeschaltet.")
        }

        this._updateSamples();
      },
      error: (err) => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_UPDATE);
        this.isError = true;
      }
    });
  }
}
