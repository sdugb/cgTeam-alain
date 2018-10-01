import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TeamService } from '../team.service';
import { ProjectService } from '../project.service';
import { PassportService } from '../../passport/passport.service';
import { LocalStorage } from '../../../core/local.storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myMembers',
    templateUrl: './myMembers.component.html',
    providers: [ LocalStorage ]
    // styleUrls: ['./myMembers.component.less']
})

export class MyMembersComponent implements OnInit {
    userName: String;
    userRole: String;
    memberList: any = [];
    memberTotal = 0;
    teamName: String;
    data: any = [];
    roleList = [{name: '项目主管', value: 'manager'}, {name: '设计师', value: 'designer'}];
    statusList = [{name: '激活', value: true}, {name: '休眠', value: false}];
    allMemberChecked = false;
    sortMap = {
        name   : null
    };
    sortName = null;
    sortValue = null;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private _projectService: ProjectService,
        private _passportService: PassportService,
        private msg: NzMessageService,
        private _router: Router) {}

    ngOnInit() {
        console.log('ngOnInit');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        this.userName = currentUser.username;
        this.userRole = currentUser.role;
        if (this.userRole === 'designer') {
            this.msg.warning('你只是设计人员，没有权利（消息将于10秒后消失）', {nzDuration: 10000});
            this._router.navigate(['/']);
        }
        this.onClickRefreshMember();
    }

    sort_user(sortName, value) {
        this.sortName = sortName;
        this.sortValue = value;
        Object.keys(this.sortMap).forEach(key => {
            if (key !== sortName) {
                this.sortMap[ key ] = null;
            } else {
                this.sortMap[ key ] = value;
            }
        });
        this.search();
    }

    search() {
        // this.memberList = [ ...this.memberList_copyData.filter(item => filterFunc(item)) ];
        this.memberList = [ ...this.memberList.sort((a, b) => {
            if (a[ this.sortName ] > b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[ this.sortName ] < b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        }) ];
    }

    onClickRefreshMember() {
        this.memberList = [];
        this.memberTotal = 0;
        if (this.userRole === 'manager' || this.userRole === 'designer') {
            return;
        }
        this.teamName = JSON.parse(localStorage.getItem('teamName'));
        if (!this.teamName) {
            this._router.navigate(['/']);
            return;
        }
        this._teamService.getTeamMember(this.teamName).subscribe(data1 => {
            for (let i = 0; i < data1.length; i++) {
                data1[i].editFlag = false;
                data1[i].addFlag = false;
                if (data1[i].role === 'manager')
                    data1[i].roleAlias = '项目主管';
                else if (data1[i].role === 'designer')
                    data1[i].roleAlias = '设计师';
            }
            // console.log(data1);
            if (this.allMemberChecked) {
                this.memberList = data1;
            } else {
                this.memberList = [];
                for (let i = 0; i < data1.length; i++) {
                    if (data1[i].enable)
                        this.memberList.push(data1[i]);
                }
                // console.log(this.memberList);
            }
            this.memberTotal = this.memberList.length;
            // console.log(this.memberTotal);
            },
                error => {
                this.memberList = [];
                this.memberTotal = 0;
            });
    }

    onClickMemberChecked() {
        this.onClickRefreshMember();
    }

    cancelMember = function () {
        this.msg.info('click cancel');
    };

    confirmMember = (member) => {
        this.msg.info('click confirm');
        /*
        this._teamService.deleteTeam(team._id).subscribe(data => {
            this.onClickRefreshTeam();
        });
        */
    }

    onClickRole(user, role) {
        user.role = role.value;
        console.log(user);
        this._teamService.setUserInfo(user._id, user).subscribe(data => {
            this.onClickRefreshMember();
        });
    }

    onActivateMember(user) {
        console.log(user);
        user.enable = true;

        this._teamService.setUserInfo(user._id, user).subscribe(data => {
            this.onClickRefreshMember();
        });
    }

    onUnActivateMember(user) {
        console.log(user);
        user.enable = false;
        console.log(user);
        this._teamService.setUserInfo(user._id, user).subscribe(data => {
            this.onClickRefreshMember();
        });
    }

    onEidt(user) {
        user.editFlag = !user.editFlag;
    }

    onOk(user) {
        console.log('OK');
        console.log(user);
        if (user.addFlag) {
            if (!user.username) {
                this.memberList.pop();
                user.addFlag = false;
            } else {
                user.password = user.username + '1234';
                user.team = this.teamName;
                this._teamService.register(user).subscribe(data => {
                    console.log(data);
                    this.onClickRefreshMember();
                });
            }
        } else {
            user.editFLag = false;
            this._teamService.setUserInfo(user._id, user).subscribe(data => {
                this.onClickRefreshMember();
            });
        }

    }

    onCancel(user) {
        if (user.addFLag) {
            user.addFLag = false;
            this.memberList.pop();
        }
        user.editFLag = false;
    }

    onClickAddMember() {
        const member = {name: '', alias: '', role: 'designer', enable: true,
                                        roleAlias: '设计师', editFlag: false, addFlag: true};
        this.memberList.push(member);
    }
}
