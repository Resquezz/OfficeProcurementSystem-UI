import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesPageComponent } from './components/categories-page.component';

@NgModule({
  imports: [CategoriesPageComponent, RouterModule.forChild([{ path: '', component: CategoriesPageComponent }])]
})
export class CategoriesModule {}