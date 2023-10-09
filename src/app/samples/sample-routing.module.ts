import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveSampleComponent } from './archive-sample/archive-sample.component';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SearchSampleComponent } from './search-sample/search-sample.component';
import { DeleteSampleComponent } from './delete-sample/delete-sample.component';
import { authGuard } from '../auth-guard';
import { DearchiveSampleComponent } from './dearchive-sample/dearchive-sample.component';

const routes: Routes = [
  {path: 'create', component: CreateSampleComponent, title: 'Probe anlegen', canActivate: [authGuard]},
  {path: 'archive', component: ArchiveSampleComponent, title: 'Probe archivieren', canActivate: [authGuard]},
  {path: 'search', component: SearchSampleComponent, title: 'Probe suchen', canActivate: []},
  {path: 'delete', component: DeleteSampleComponent, title: 'Probe löschen', canActivate: [authGuard]},
  {path: 'dearchive', component: DearchiveSampleComponent, title: 'Probe aus dem Archiv entfernen', canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRoutingModule { }
