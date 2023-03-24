import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { SampleAPIService } from '../sample-api.service';

@Component({
  selector: 'app-archive-sample',
  templateUrl: './archive-sample.component.html',
  styleUrls: ['./archive-sample.component.scss']
})
export class ArchiveSampleComponent {

    constructor(
      private authService: AuthService,
      private messageService: MessageService,
      private sampleAPIService: SampleAPIService) {
        const fb = new FormBuilder();
      }

    
}
