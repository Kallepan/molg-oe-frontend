import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SampleRoutingModule } from './sample-routing.module';
import { ArchiveSampleComponent } from './archive-sample/archive-sample.component';
import { SearchSampleComponent } from './search-sample/search-sample.component';
import { AdditionalPrintDialogComponent } from './create-sample/additional-print-dialog/additional-print-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExportComponent } from './create-sample/export/export.component';
import { ValidateSampleComponent } from './validate-sample/validate-sample.component';

const dialogMock = {
  close: () => {},
}

@NgModule({
  declarations: [
    CreateSampleComponent,
    ArchiveSampleComponent,
    SearchSampleComponent,
    AdditionalPrintDialogComponent,
    ExportComponent,
    ValidateSampleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SampleRoutingModule,
  ],
  providers: [
    {provide: MAT_DIALOG_DATA, useValue: {
      originalSampleId: null,
    }},
    {provide: MatDialogRef, useValue: dialogMock},
  ]
})
export class SamplesModule {
  
}
