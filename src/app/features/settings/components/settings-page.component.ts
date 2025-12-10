import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SettingOption } from '../interfaces/settings.model';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly settingsService = inject(SettingsService);

  readonly options: SettingOption[] = this.settingsService.getOptions();
}