import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CONSTANTS } from './config/constants';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'proben', loadChildren: () => import('./samples/samples.module').then(m => m.SamplesModule), title: 'Proben'},
  {path: 'hilfe', component: HelpComponent, title: "Hilfe"},
  {path: '**', component: HomeComponent, title: CONSTANTS.TITLE},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
