import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { App } from './app';
import { routes } from './app.routes';
import { TitlecaseCustomPipe } from './shared/pipes/titlecase.pipe';
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';
import { LoggerService } from './core/services/logger.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@Component({
  selector: 'app-shell-module-bridge',
  template: '<app-root></app-root>',
  standalone: false
})
export class AppModuleShell {}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    App,
    TitlecaseCustomPipe,
    AutoFocusDirective
  ],
  declarations: [AppModuleShell],
  providers: [
    LoggerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppModuleShell]
})
export class AppModule {}
