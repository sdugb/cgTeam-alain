import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

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

import { TeamService } from '../function/team.service';
import { LocalStorage } from '../../core/local.storage';
import { ProjectService } from '../function/project.service';

import { FormsModule } from '@angular/forms';
import { XlsxToJsonService } from './batchTask/xlsx-to-json.service';

@NgModule({
  imports: [ SharedModule, PagesRoutingModule,  FormsModule
  ],
  declarations: [
    LoginComponent,
    LockComponent,
    RegisterComponent,
    ForgetComponent,
    MaintenanceComponent,
    Page404Component,
    Page500Component,


      ProjectComponent,
      SubProjectComponent,
      TaskComponent,
      BatchTaskComponent,
      ChangeAssetPathComponent,
      WatchComponent,
      WatchListComponent,
      WatchProjectComponent,
      RenderComponent,
      ModifyPasswordComponent
  ],
    providers: [TeamService, LocalStorage, ProjectService, XlsxToJsonService]
})
export class PagesModule { }
