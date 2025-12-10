import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsPageComponent } from './components/settings-page.component';

@NgModule({
  imports: [SettingsPageComponent, RouterModule.forChild([{ path: '', component: SettingsPageComponent }])]
})
export class SettingsModule {}