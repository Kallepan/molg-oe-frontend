import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveSampleComponent } from './archive-sample/archive-sample.component';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SearchSampleComponent } from './search-sample/search-sample.component';

const routes: Routes = [
  {path: '', component: CreateSampleComponent, title: 'Probe anlegen'},
  {path: 'archiv', component: ArchiveSampleComponent, title: 'Probe archivieren'},
  {path: 'search', component: SearchSampleComponent, title: 'Probe suchen'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRoutingModule { }
