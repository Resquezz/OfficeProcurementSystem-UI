import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CliSampleComponent } from './cli-sample.component';

const routes: Routes = [
  { path: '', component: CliSampleComponent }
];

@NgModule({
  imports: [CommonModule, CliSampleComponent, RouterModule.forChild(routes)]
})
export class CliSampleModule {}
