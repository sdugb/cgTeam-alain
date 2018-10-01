import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMembersComponent } from './myMembers/myMembers.component';
import { MyProjectsComponent } from './myProjects/myProjects.component';
import { MyTemplatesComponent } from './myTemplates/myTemplates.component';
import { MyTasksComponent } from './myTasks/myTasks.component';
import { MyCheckinTasksComponent } from './myCheckinTasks/myCheckinTasks.component';
import { MyFinishedTasksComponent } from './myFinishedTasks/myFinishedTasks.component';
import { MyRenderTasksComponent } from './myRenderTasks/myRenderTasks.component';
import { MySoftwaresComponent } from './mySoftwares/mySoftwares.component';

const routes: Routes = [
    { path: 'myProjects', component: MyProjectsComponent},
    { path: 'myMembers', component: MyMembersComponent},
    { path: 'myTemplates', component: MyTemplatesComponent},
    { path: 'myTasks', component: MyTasksComponent},
    { path: 'myCheckinTasks', component: MyCheckinTasksComponent},
    { path: 'myFinishedTasks', component: MyFinishedTasksComponent},
    { path: 'myRenderTasks', component: MyRenderTasksComponent},
    { path: 'mySoftwares', component: MySoftwaresComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FunctionRoutingModule { }
