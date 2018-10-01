import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TeamService } from '../team.service';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myTemplates',
    templateUrl: './myTemplates.component.html',
    providers: [ LocalStorage ]
    //styleUrls: ['./myTemplates.component.less']
})

export class MyTemplatesComponent implements OnInit {
    userName: String;
    templateList: any = [];
    templateTotal = 0;

    sortMap = {
        name   : null,
        app_count    : null
    };
    sortName = null;
    sortValue = null;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
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
        this.onClickRefreshTemplate();
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
        console.log('search');
        /*
        const searchAddress = this.filterAddressArray.filter(address => address.value);
        const searchName = this.filterNameArray.filter(name => name.value);
        const filterFunc = (item) => {
            return (searchAddress.length ? searchAddress.some(address => item.address.indexOf(address.name) !== -1) : true) &&
                (searchName.length ? searchName.some(name => item.name.indexOf(name.name) !== -1) : true)
        };
        */
        //this.userList = [ ...this.userList_copyData.filter(item => filterFunc(item)) ];
        /*
        this.teamList = [ ...this.teamList.sort((a, b) => {
            if (a[ this.sortName ] > b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[ this.sortName ] < b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        }) ];
        */
    }

    onClickRefreshTemplate() {
        this.templateList = [];
        this._teamService.getMyTemplates(this.userName).subscribe(data => {
                this.templateList = data;
                this.templateTotal = data.length;
            },
            error => {
                this.templateList = [];
            });
    }

    onClickCreateTemplate() {
        this._router.navigate(['/pages/template']);
    }
/*
    onSelectTeam(team) {
        this._localStorage.setObject('teamName', team.name);
        this._localStorage.setObject('teamAlias', team.alias);
        this.teamName = team.name;
        this.teamAlias = team.alias;
        this.subProjectTitle = '"' + this.teamAlias + '"的子项目：';
        this.subProjectList = [];
        this._teamService.getMySubProjects(this.userName).subscribe((data: any) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].team === this.teamName)
                    this.subProjectList.push(data[i]);
            }
            this.subProjectTotal = data.length;
        });
    }
*/
    cancelTemplate = function () {
        this.msg.info('click cancel');
    };

    confirmTemplate = (template) => {
        this.msg.info('click confirm');
        this._teamService.deleteTemplate(template._id).subscribe(data => {
            this.onClickRefreshTemplate();
        });
    }
}
