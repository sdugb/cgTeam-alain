import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectService } from '../project.service';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myTasks',
    templateUrl: './myRenderTasks.component.html'
    //styleUrls: ['./myTasks.component.less']
})

export class MyRenderTasksComponent implements OnInit {
    userName: String;
    taskList: any = [];
    taskTotal = 0;
    data: any = [];

    sortMap = {
        name   : null,
        app_count    : null
    };
    sortName = null;
    sortValue = null;

    constructor(
        private _localStorage: LocalStorage,
        private _projectService: ProjectService,
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
        this.onClickRefreshTask();
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
        // this.userList = [ ...this.userList_copyData.filter(item => filterFunc(item)) ];
        this.taskList = [ ...this.taskList.sort((a, b) => {
            if (a[ this.sortName ] > b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[ this.sortName ] < b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        }) ];
    }

    onClickRefreshTask() {
        this.taskList = [];
        this._projectService.getMyTasks(this.userName).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                if (!data[i].isDone)
                    data[i].status = '设计';
                else if (data[i].isDone && !data[i].isFinished)
                    data[i].status = '审验';
                else
                    data[i].status = '完成';
            }
            this.data = data;
            this.taskTotal = data.length;
            },
            error => {
                this.data = [];
                this.taskTotal = 0;
            });
    }

    onCreateRenderTasks = function() {
        this._router.navigate(['/pages/render']);
    };

    cancelTask = function () {
        this.msg.info('click cancel');
    };

    confirmTask = (task) => {
        this.msg.info('click confirm');
        this._projectService.deleteTask(task).subscribe(data => {
            this.onClickRefreshTask();
        });
    }

    onSubmitTask(task) {
        this._projectService.submitTask(task._id).subscribe(data => {
            this.onClickRefreshTask();
        });
    }
}
