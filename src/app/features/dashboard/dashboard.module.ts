import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';

@NgModule({
  imports: [DashboardComponent, RouterModule.forChild([{ path: '', component: DashboardComponent }])]
})
export class DashboardModule {}