import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PurchasesPageComponent } from './components/purchases-page.component';

@NgModule({
  imports: [PurchasesPageComponent, RouterModule.forChild([{ path: '', component: PurchasesPageComponent }])]
})
export class PurchasesModule {}