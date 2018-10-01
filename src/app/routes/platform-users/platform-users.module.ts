import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PlatformUsersRoutingModule } from './platform-users-routing.module';
import { ListComponent } from './list/list.component';
import { CurrentUserListComponent } from './current-user/current-user.component';
import { PlatformUserService } from './platformUser.service';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PlatformUsersRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ListComponent,
      CurrentUserListComponent
  ],
    providers: [PlatformUserService],
  entryComponents: COMPONENT_NOROUNT
})
export class PlatformUsersModule { }
