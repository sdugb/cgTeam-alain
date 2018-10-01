import { Component, OnInit } from '@angular/core';
import { PlatformUserService } from '../platformUser.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-currentUser',
    templateUrl: './current-user.component.html'
})
export class CurrentUserListComponent implements OnInit {

    userList: any = [];
    appList: any = [];
    user: any = {};
    total = 0;
    start = null;
    end = null;

    sortMap = {
        name   : null,
        app_count    : null
    };
    sortName = null;
    sortValue = null;
    userList_copyData = [ ...this.userList ];
    days = 1;
    userTotal = 0;
    appTotal = 0;


    constructor(private _platformUserService: PlatformUserService, private msg: NzMessageService) {
        this.setDate();
    }

    setDate() {
        this.end = new Date().toLocaleDateString();
        let tt = Date.parse(this.end) - this.days * 24*60*60 * 1000;
        this.start = new Date(tt).toLocaleDateString();
    }

    ngOnInit() {
        this.userList = [];
        this.appList = [];
        this.refresh();
    }

    refresh() {
        this.userList = [];
        this._platformUserService.getUsers().subscribe((res: any) => {

            for (let user of res) {
                let dd = new Date(user.last_login_time* 1000).toLocaleDateString();
                if (this.end >= dd && this.start <= dd) {
                    this.userList.push({name: user.name, id: user.id, app_count: user.app_count,
                        loginDate: dd, system_uid: user.system_uid});
                }
            }
            this.userTotal = this.userList.length;
        });
    }

    searchUser(days) {
        this.days = days;
        this.setDate();
        this.refresh();
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
        /*
        const searchAddress = this.filterAddressArray.filter(address => address.value);
        const searchName = this.filterNameArray.filter(name => name.value);
        const filterFunc = (item) => {
            return (searchAddress.length ? searchAddress.some(address => item.address.indexOf(address.name) !== -1) : true) &&
                (searchName.length ? searchName.some(name => item.name.indexOf(name.name) !== -1) : true)
        };
        */
        //this.userList = [ ...this.userList_copyData.filter(item => filterFunc(item)) ];
        this.userList = [ ...this.userList.sort((a, b) => {
            if (a[ this.sortName ] > b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[ this.sortName ] < b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        }) ];
    }

    onSelectUser(user) {
        this.user = user;
        this.appList = [];
        this._platformUserService.getUserApps(user.system_uid).subscribe((res: any) => {
            console.log('res =', res);
            this.appList = res;
            this.appTotal = res.length;
        });
    }
}


