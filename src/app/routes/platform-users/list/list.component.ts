import { Component, OnInit } from '@angular/core';
import { PlatformUserService } from '../platformUser.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

    userList: any = [];
    appList: any = [];
    user: any = {};
    userTotal = 0;
    appTotal = 0;


    sortMap = {
        name   : null,
        app_count    : null
    };
    sortName = null;
    sortValue = null;
    userList_copyData = [ ...this.userList ];

    constructor(private _platformUserService: PlatformUserService, private msg: NzMessageService) {}

    ngOnInit() {
        this.userList = [];
        console.log('list-ngOnInit');
        this._platformUserService.getUsers().subscribe((res: any) => {
            console.log('res =', res);
            for (let user of res) {

                let hm = user.last_login_time;
                let unixTimestamp = new Date(hm * 1000);
                this.userList.push({
                    name: user.name, id: user.id, app_count: user.app_count,
                    loginDate: unixTimestamp.toLocaleString(),
                    system_uid: user.system_uid
                });
            }
            this.userTotal = this.userList.length;
        });
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
        this._platformUserService.getUserApps(user.system_uid).subscribe((res: any) => {
            console.log('res =', res);
            this.appList = res;
            this.appTotal = res.length;
        });
    }
}


