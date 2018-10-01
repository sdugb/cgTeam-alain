import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CurrentUserListComponent } from './current-user/current-user.component';

const routes: Routes = [
        { path: 'list', component: ListComponent},
        { path: 'currentUser', component: CurrentUserListComponent}
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformUsersRoutingModule { }
