import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TitlecaseCustomPipe } from './shared/pipes/titlecase.pipe';
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TitlecaseCustomPipe, AutoFocusDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('OfficeProcurementSystem-UI');
}
