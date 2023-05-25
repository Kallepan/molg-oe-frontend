import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ERRORS } from 'src/app/config/errors.module';
import { AuthService } from 'src/app/login/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { SampleAPIService } from '../../sample-api.service';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  exportPath = '\\\\datensilo\\Gruppenordner\\Lab2Mirth\\Gennum';

  minDate: Date;
  maxDate: Date;
  showExportInfo = false;
  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;

    const day = (d || new Date()).getDay();

    // Prevent day from being selected
    return day !== 0 && day !== 6;
  }

  constructor(
    private sampleAPIService: SampleAPIService,
    private authService: AuthService,
    private messageService: MessageService) {
    const currentDate = new Date();
    this.maxDate = currentDate;
    this.minDate = new Date(currentDate.getFullYear() - 1, 0, 1);
  }

  submit() {
    if (!this.authService.checkLoginWithDisplayMessage(ERRORS.ERROR_LOGIN)) return;


    this.sampleAPIService.requestExport().subscribe({
      next: (resp) => {
        // Get timestamp for file name
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString(); // Do not forget to add 1 haha
        const day = date.getDate().toString();
        const hour = date.getHours().toString();
        const minute = date.getMinutes().toString();
        const second = date.getSeconds().toString();

        const blob: Blob = resp.body;
        const a = document.createElement('a');
        const objUrl = URL.createObjectURL(blob);
        
        a.href = objUrl;
        a.download = `molg_export_${year}-${month}-${day}_${hour}-${minute}-${second}.csv`;
        a.click();
        URL.revokeObjectURL(objUrl);
        this.showExportInfo = true;
      }, error: (err) => {
        if (err.status === 404) {
          this.messageService.simpleWarnMessage(`${ERRORS.NO_SAMPLES}`);
          return;
        }
        this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
      }
    });

    
    // Not needed anymore, but I'll leave it here for now
    // const date: Date | null = this.dateFormControl.value;

    // if (!date) return;
    // const year  = date.getFullYear().toString();
    // const month = (date.getMonth() + 1).toString(); // Do not forget to add 1 haha
    // const day   = date.getDate().toString();

    // this.sampleAPIService.requestExportBySample(year, month, day).subscribe({
    //   next: (resp) => {
    //     const blob: Blob = resp.body;
    //     const a = document.createElement('a');
    //     const objUrl = URL.createObjectURL(blob);

    //     a.href = objUrl;
    //     a.download = `molg_export_${year}-${month}-${day}.csv`;
    //     a.click();
    //     URL.revokeObjectURL(objUrl);
    //   }, error: (err) => {
    //     if (err.status === 404) {
    //      this.messageService.simpleWarnMessage(`${day}.${month}.${year} ${ERRORS.NO_SAMPLES}`);
    //      return;
    //     }
    //     this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
    //   }
    // });
  }

  copyPath(event: any) {
    event.preventDefault();
    try {
      window.open("file:///datensilo/Gruppenordner/Lab2Mirth/Gennum");
    } catch (e) {
      //console.log(e);
    }
    navigator.clipboard.writeText(this.exportPath);
    this.messageService.goodMessage('Pfad wurde in die Zwischenablage kopiert');
  }
}
