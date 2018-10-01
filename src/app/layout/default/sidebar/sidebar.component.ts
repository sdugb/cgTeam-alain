import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { LocalStorage } from '../../../core/local.storage';
import { Router } from '@angular/router';

@Component({
  selector   : 'app-sidebar',
  templateUrl: './sidebar.component.html',
    providers: [ LocalStorage ]
})
export class SidebarComponent {
    userName: String;
    userAlias: String;
    userRole: String;

    constructor(public settings: SettingsService,
                private _localStorage: LocalStorage,
                private _router: Router,
                public msgSrv: NzMessageService) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('currentUser1 =', currentUser);
        if (!currentUser || currentUser.status) {
            this._router.navigate(['/']);
            return;
        }else {
            this.userName = currentUser.username;
            this.userAlias = currentUser.alias;
            this.userRole = currentUser.role;
            if (this.userRole === 'designer')
                this.userRole = '设计员';
            else if (this.userRole === 'manager')
                this.userRole = '项目主管';
            else if (this.userRole === 'admin')
                this.userRole = '团队主管';
            else
                this.userRole = '超级用户';
        }
    }
}
