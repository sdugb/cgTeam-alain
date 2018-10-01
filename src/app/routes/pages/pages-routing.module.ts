import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LockComponent } from './lock/lock.component';
import { RegisterComponent } from './register/register.component';
import { ForgetComponent } from './forget/forget.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './404/404.component';
import { Page500Component } from './500/500.component';
import { ProjectComponent } from './project/project.component';
import { SubProjectComponent } from './subProject/subProject.component';
import { TaskComponent } from './task/task.component';
import { BatchTaskComponent } from './batchTask/batchTask.component';
import { WatchComponent } from './watch/watch.component';
import { WatchListComponent } from './watchList/watchList.component';
import { WatchProjectComponent } from './watchProject/watchProject.component';
import { ChangeAssetPathComponent } from './changeAssetPath/changeAssetPath.component';
import { RenderComponent } from './render/render.component';
import { ModifyPasswordComponent } from './modifyPassword/modifyPassword.component';

const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forget', component: ForgetComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Page404Component },
    { path: '500', component: Page500Component },
    { path: 'project', component: ProjectComponent },
    { path: 'subProject', component: SubProjectComponent },
    { path: 'task', component: TaskComponent },
    { path: 'batchTask', component: BatchTaskComponent },
    { path: 'changeAssetPath', component: ChangeAssetPathComponent },
    { path: 'watch', component: WatchComponent },
    { path: 'watchList', component: WatchListComponent },
    { path: 'watchProject', component: WatchProjectComponent },
    { path: 'render', component: RenderComponent },
    { path: 'modifyPassword', component: ModifyPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
