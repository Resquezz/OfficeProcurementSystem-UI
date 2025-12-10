import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BudgetsPageComponent } from './components/budgets-page.component';

@NgModule({
  imports: [BudgetsPageComponent, RouterModule.forChild([{ path: '', component: BudgetsPageComponent }])]
})
export class BudgetsModule {}