import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FunctionRoutingModule } from './function-routing.module';
import { MyMembersComponent } from './myMembers/myMembers.component';
import { MyProjectsComponent } from './myProjects/myProjects.component';
import { MyTemplatesComponent } from './myTemplates/myTemplates.component';
import { MyTasksComponent } from './myTasks/myTasks.component';
import { MyCheckinTasksComponent } from './myCheckinTasks/myCheckinTasks.component';
import { MyFinishedTasksComponent } from './myFinishedTasks/myFinishedTasks.component';
import { MyRenderTasksComponent } from './myRenderTasks/myRenderTasks.component';
import { MySoftwaresComponent } from './mySoftwares/mySoftwares.component';

import { LocalStorage } from '../../core/local.storage';
import { TeamService } from './team.service';
import { ProjectService } from './project.service';
import { PassportService } from '../passport/passport.service';

const COMPONENT_NOROUNT = [];

@NgModule({
    imports: [
        SharedModule,
        FunctionRoutingModule
    ],
    declarations: [
        ...COMPONENT_NOROUNT,
        MyMembersComponent,
        MyProjectsComponent,
        MyTemplatesComponent,
        MyTasksComponent,
        MyCheckinTasksComponent,
        MyFinishedTasksComponent,
        MyRenderTasksComponent,
        MySoftwaresComponent
    ],
    providers: [ TeamService, ProjectService, LocalStorage, PassportService],
    entryComponents: COMPONENT_NOROUNT
})
export class FunctionModule { }
