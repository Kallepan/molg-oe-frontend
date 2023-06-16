import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthDialogComponent } from './login/auth-dialog/auth-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ErrorCatchingInterceptor, GlobalInterceptor } from './app-interceptor.module';
import { HelpComponent } from './help/help.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthDialogComponent,
    HomeComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorCatchingInterceptor, multi: true},
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
