import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersPageComponent } from './components/users-page.component';

@NgModule({
  imports: [UsersPageComponent, RouterModule.forChild([{ path: '', component: UsersPageComponent }])]
})
export class UsersModule {}