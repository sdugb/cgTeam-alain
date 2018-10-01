import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectService } from '../project.service';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myTasks',
    templateUrl: './myTasks.component.html',
    providers: [ LocalStorage ]
    // styleUrls: ['./myTasks.component.less']
})

export class MyTasksComponent implements OnInit {
    userName: String;
    taskList: any = [];
    taskTotal = 0;
    data: any = [];
    selectedTask = null;

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
        private _router: Router) {

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentTeam = JSON.parse(localStorage.getItem('currentTeam'));
        if (!currentUser || !currentTeam || currentUser.status) {
            this._router.navigate(['/']);
            return;
        }
        this.userName = currentUser.username;
    }

    ngOnInit() {
        console.log('ngOnInit');

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
        //this.userList = [ ...this.userList_copyData.filter(item => filterFunc(item)) ];
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
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (!data[i].isDone)
                    data[i].status = '设计';
                else if (data[i].isDone && !data[i].isFinished)
                    data[i].status = '审验';
                else
                    data[i].status = '完成';
                data[i].editFlag = false;
                if (data[i].frameList === undefined)
                    data[i].frameList = '';
            }
            this.data = data;
            this.taskTotal = data.length;
            },
            error => {
                this.data = [];
                this.taskTotal = 0;
            });
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

    cancelTask = function () {
        this.msg.info('click cancel');
    };

    confirmTask = (task) => {
        this.msg.info('click confirm');
        this._projectService.deleteTask(task).subscribe(data => {
            console.log(data);
        });
    }

    onSubmitTask(task) {
        if (task.stage === '渲染') {
            this._projectService.getProjectInfo(task.projectName).subscribe(data => {
                console.log(data);
                if (data[0].render === 'renderwing') {
                    this._projectService.getProjectInfo(task.projectName).subscribe(data1 => {
                        console.log(data1);
                        const project = data1[0];
                        if (data[0].render === 'renderwing') {
                            this._projectService.GetAninmationFile(task.projectName, task.assetID).subscribe(data2 => {
                                console.log(data2);
                                const taskList = [{_id: task._id, submitFileList: [data2.url], render: 'renderwing'}];
                                this._projectService.RenderJobSubmit(project.team, this.userName, project.name, taskList).subscribe(data3 => {

                                });
                            });
                        }
                    });
                }
            });
        } else
            this._projectService.submitTask(task._id).subscribe(data => {
                this.onClickRefreshTask();
            });
    }

    editFrameList(task) {
        task.editFlag = true;
    }

    editFrameListOK(task) {

        this._projectService.SetTaskRenderFrames(task._id, task.frameList).subscribe(data => {
            task.editFlag = false;
        });
    }

    editFrameListCANCEL(task) {
        task.editFlag = false;
    }

    onClickExpandTask(task) {
        if (this.selectedTask === null) {
            task.expand = true;
        } else if (this.selectedTask === task) {
            task.expand = !task.expand;
        } else {
            this.selectedTask.expand = false;
            this.selectedTask.nzShowExpand = true;
            task.expand = true;
        }
        this.selectedTask = task;
    }

}
