import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuppliersPageComponent } from './components/suppliers-page.component';

@NgModule({
  imports: [SuppliersPageComponent, RouterModule.forChild([{ path: '', component: SuppliersPageComponent }])]
})
export class SuppliersModule {}