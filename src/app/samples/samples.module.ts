import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SampleRoutingModule } from './sample-routing.module';
import { ArchiveSampleComponent } from './archive-sample/archive-sample.component';
import { SearchSampleComponent } from './search-sample/search-sample.component';

@NgModule({
  declarations: [
    CreateSampleComponent,
    ArchiveSampleComponent,
    SearchSampleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SampleRoutingModule,
  ]
})
export class SamplesModule {
  
}
