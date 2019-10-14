import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';

import { FormComponents } from './form-components';
import { AppComponent } from './app.component';

const MaterialModules = [MatInputModule, MatDatepickerModule, MatNativeDateModule];

@NgModule({
  declarations: [AppComponent, ...FormComponents],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    ...MaterialModules,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
