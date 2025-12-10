import { Injectable } from '@angular/core';
import { SettingOption } from '../interfaces/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  getOptions(): SettingOption[] {
    return [
      {
        key: 'notifications',
        label: 'Email-сповіщення',
        description: 'Отримувати сповіщення про нові заявки та зміни статусів',
        enabled: true
      },
      {
        key: 'darkMode',
        label: 'Темна тема',
        description: 'Увімкнути темний режим інтерфейсу',
        enabled: false
      }
    ];
  }
}