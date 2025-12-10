import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { App } from './app';
import { routes } from './app.routes';

// This module is added to satisfy methodological requirements; the app still bootstraps via standalone.
@NgModule({
  declarations: [],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: []
})
export class AppModule {}
