import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectService } from '../project.service';
import { TeamService } from '../team.service';
import { PassportService } from '../../passport/passport.service';
import { LocalStorage } from '../../../core/local.storage';
import { Router } from '@angular/router';
import { EventService } from '../../../event.service';

@Component({
    selector: 'app-function-myProjects',
    templateUrl: './myProjects.component.html',
    providers: [ LocalStorage ]
})

export class MyProjectsComponent implements OnInit, OnDestroy {
    projectList: any = [];
    project: any = {};
    taskList: any = [];
    userList: any = [];
    projectTotal = 0;
    taskTotal = 0;
    userName: String;
    userRole: String;
    teamName: String;
    projectName: string;
    taskTitle: String;
    data: any = [];
    statusList: any = [];
    diffcultList: any = [];
    projectFlag = true;
    allProjectChecked = false;
    designToolList = [];
    renderList = [];
    stageList = [];
    selectedProject = null;
    selectedTask = null;
    currentUser: any = [];
    currentTeam: any = [];
    stageFlag = false;
    refString: String;

    isVisible = false;


    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private _projectService: ProjectService,
        private _passportService: PassportService,
        public eventService: EventService,
        private msg: NzMessageService,
        private _router: Router) {

        this.statusList = [{name: '设计'}, {name: '审验'}, {name: '完成'}];
        this.diffcultList = [{name: '难度:A'}, {name: '难度:B'}, {name: '难度:C'}, {name: '难度:D'}, {name: '难度:E'}];
        this.designToolList = [{name: 'maya2014'},
            {name: 'maya2016'},
            {name: '3dsMax2014'},
            {name: '3dsMax2016'}];
        this.renderList = [{name: 'arnold'},
                            {name: 'redshift'},
                            {name: '3dsMax'},
                            {name: 'Vray'},
                            {name: 'mayaSoftware'},
                            {name: 'renderwing'}];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.teamName = JSON.parse(localStorage.getItem('teamName'));
        console.log('currentUser2 =', this.currentUser);
        if (this.currentUser === null) {
            this._router.navigate(['/']);
            return;
        }

        this.userName = this.currentUser.username;
        this.userRole = this.currentUser.role;
        this.eventService.change.subscribe((value: number) => {
            if (value === 1) {
                this.projectName = JSON.parse(localStorage.getItem('projectName'));
                this.onSelectProject(this.projectName);
            }
        });
    }

    ngOnInit() {
        this.projectList = [];
        if (this.userRole === 'designer') {
            this.msg.warning('你只是设计人员，没有权利（消息将于10秒后消失）', {nzDuration: 10000});
            this._router.navigate(['/function/myTasks']);
            return;
        }

        this._teamService.getTeamMember(this.teamName).subscribe(data => {
            // console.log(data);
            this.userList = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].enable)
                    this.userList.push(data[i]);
            }
            console.log('userList =', this.userList);
            // this.userList = data;
            this.onClickRefreshProject();
        });
    }

    ngOnDestroy() {
        // this.global.valueUpdated.unsubscribe();
    }

    onClickProject(project) {
        if (project.templateName === '3DAsset')
            this.stageFlag = true;
        else
            this.stageFlag = false;
        this._projectService.GetTasksOfProject(project.name).subscribe(data2 => {
                for (let i = 0; i < data2.length; i++) {
                    if (!data2[i].isDone)
                        data2[i].status = '设计';
                    else if (data2[i].isDone && !data2[i].isFinished)
                        data2[i].status = '审验';
                    else
                        data2[i].status = '完成';
                    if (data2[i].frameList === undefined)
                        data2[i].frameList = '';
                    data2[i].refString = '';
                    const refAssetIDList = data2[i].refAssetIDList;
                    for (let j = 0; j < refAssetIDList.length; j++) {
                        data2[i].refString = data2[i].refString + refAssetIDList[j].name + '; ';
                    }
                    data2[i].editFlag = false;
                }
            this.taskList = data2;
            console.log('daya =', this.taskList);
            this.taskTotal = data2.length;
            this.taskTitle = '项目' + this.projectName + '的任务列表:(总数：' + this.taskTotal + ')';
            },
        error => {
            this.taskList = [];
            this.taskTotal = 0;
            this.taskTitle = '';
        });
    }

    onClickRefreshProject() {
        this.projectList = [];
        this.projectTotal = 0;
        this._projectService.getCompleteProjects().subscribe(data1 => {
            if (this.allProjectChecked) {
                this.projectList = data1;
                this.projectTotal = data1.length;
            } else {
                for (let i = 0; i < data1.length; i++) {
                    if (data1[i].enable)
                        this.projectList.push(data1[i]);
                }
                this.projectTotal = this.projectList.length;
            }
            if (this.projectTotal > 0) {
                this.project = this.projectList[0];
                this.projectName = this.projectList[0].name;
                localStorage.setItem('currentProject', JSON.stringify(this.projectName));
            }
        },
        error => {
            this.projectList = [];
            this.projectTotal = 0;
        });
    }

    onClickRender(project, render) {
        project.render = render.name;
        this._projectService.setProjectInfo(project).subscribe(data1 => {
            this.onClickRefreshProject();
        });
    }

    onClickDesignTool(project, designTool) {
        project.designTool = designTool.name;
        this._projectService.setProjectInfo(project).subscribe(data1 => {
            this.onClickRefreshProject();
        });
    }

    onClickProjectCheck() {
        this.onClickRefreshProject();
    }

    cancelSubProject = function () {
        console.log('cancelProject');
        this.msg.info('click cancelProject cancel');

    };

    confirmSubProject = (project) => {
        this.msg.info('click confirm');
        console.log(project);
        this._projectService.deleteProject(project.name).subscribe(data => {
            this.onClickRefreshProject();
        });
    }

    onSelectProject(project) {
        console.log(project);
        this.project = project;
        this.projectName = project.name;
        if (project.templateName === '3DAsset')
            this.stageFlag = true;
        else
            this.stageFlag = false;
        this.stageList = project.templateStage.split(',');
        localStorage.setItem('projectName', JSON.stringify(this.projectName));
        this.eventService.change.emit(2);
        this.onRefreshTask();

    }

    onRefreshTask() {
        this._projectService.GetTasksOfProjectWithIcon(this.projectName).subscribe(data2 => {
                for (let i = 0; i < data2.length; i++) {
                    if (!data2[i].task.isDone)
                        data2[i].task.status = '设计';
                    else if (data2[i].task.isDone && !data2[i].task.isFinished)
                        data2[i].task.status = '审验';
                    else
                        data2[i].task.status = '完成';
                    if (data2[i].task.frameList === undefined)
                        data2[i].task.frameList = '';
                    data2[i].editFlag = false;
                    data2[i].task.expand = false;
                    data2[i].refCount = 0;
                    if (data2[i].task.refAssetIDList) {
                        data2[i].refString = '';
                        const refAssetIDList = data2[i].task.refAssetIDList;
                        data2[i].refCount = refAssetIDList.length;
                        for (let j = 0; j < refAssetIDList.length; j++) {
                            data2[i].refString = data2[i].refString + refAssetIDList[j].name + '; ';
                        }
                    }
                    if (data2[i].task === undefined || data2[i].content === null)
                        continue;
                    data2[i].picValue = 'data:image/png;base64,' + data2[i].content;

                }
                this.projectFlag = false;
                console.log(data2);
                this.data = data2;
                this.taskTotal = data2.length;
                this.taskTitle = "项目" + this.projectName + "的任务列表:(总数：" + this.taskTotal + ')';
            },
            error => {
                this.data = [];
                this.taskTotal = 0;
                this.taskTitle = '';
            });
    }

    onCreateSingleTask(projectName) {
        localStorage.setItem('projectName', JSON.stringify(projectName));
        this._router.navigate(['/pages/task']);
    }

    onCreateSingleTask2() {
        // localStorage.setItem('projectName', JSON.stringify(projectName));
        this._router.navigate(['/pages/task']);
    }

    onCreateBatchTasks(projectName) {
        localStorage.setItem('projectName', JSON.stringify(projectName));
        this._router.navigate(['/pages/batchTask']);
    }

    showSubmitFile(task) {
        if (this.project.templateName === '3DShot') {
            localStorage.setItem('taskName', JSON.stringify(task.name));
            if (task.submitMovID !== undefined || task.submitMovID) {
                localStorage.setItem('submitMovID', JSON.stringify(task.submitMovID));
                this._router.navigate(['/pages/watch']);
            }
        }
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

    onClickBack() {
        this.projectFlag = true;
    }

    onAssignAssetPath(task) {
        console.log(task.assetPath);
        this._projectService.setTaskAssetPath(task._id, task.assetPath).subscribe(data => {
            task.expand = false;
        });
    }

    changeAssetPath(task) {
        console.log(task.assetPath);
        console.log(task._id);

        localStorage.setItem('taskAssetPath', JSON.stringify(task.assetPath));
        localStorage.setItem('taskID', JSON.stringify(task._id));
        this._router.navigate(['/pages/changeAssetPath']);
    }

    handleOk = (e) => {
        console.log('点击了确定');
        this.isVisible = false;
    }

    handleCancel = (e) => {
        console.log(e);
        this.isVisible = false;
    }

    onClickExecutor(task, user) {
        task.executor = user.username;
        this._projectService.setTaskExecutor(task._id, user.username).subscribe(data1 => {
            this.onRefreshTask();
        });
    }

    onClickCheckinor(task, user) {
        task.checkinor = user.username;
        this._projectService.setTaskCheckinor(task._id, user.username).subscribe(data1 => {
            this.onRefreshTask();
        });
    }

    onClickStatus(task, status) {
        if (status === '设计') {
            task.isDone = false;
            task.isFinished = false;
        }else if (status === '审验') {
            task.isDone = true;
            task.isFinished = false;
        } else {
            task.isDone = true;
            task.isFinished = true;
        }
        this._projectService.setTaskStatus(task._id, task.isDone, task.isFinished).subscribe(data1 => {
            this.onRefreshTask();
        });
    }

    onClickDiffcult(task, diffcult) {
        const diff = diffcult.split(':')[1];
        this._projectService.setTaskDiffcult(task._id, diff).subscribe(data1 => {
            this.onRefreshTask();
        });
    }

    onClickStage(task, stage) {
        this._projectService.setTaskStage(task._id, stage).subscribe(data1 => {
            this.onRefreshTask();
        });
    }

    onClickTask(task) {
        console.log(task);
    }

    cancelTask = function () {
        this.msg.info('click cancelTask cancel');
    };

    confirmTask = (task) => {
        this.msg.info('click confirm');
        this._projectService.deleteTask(task).subscribe(data => {
            this.onClickRefreshProject();
        });
    }

    showModal = () => {
        this.isVisible = true;
    }

    onClickCreateProject() {
        this._router.navigate(['/pages/project']);
    }

    onClickExpandProject(project) {
        if (this.selectedProject === null) {
            project.expand = true;
        } else if (this.selectedProject === project) {
            project.expand = !project.expand;
        } else {
            this.selectedProject.expand = false;
            this.selectedProject.nzShowExpand = true;
            project.expand = true;
        }
        this.selectedProject = project;
    }

    onUnActivateProject(project) {
        console.log(project.enable);
        project.enable = !project.enable;
        this._projectService.setProjectInfo(project).subscribe(data => {
            this.onClickRefreshProject();
        });
    }

    onActivateProject(project) {
        console.log(project.enable);
        project.enable = !project.enable;
        this._projectService.setProjectInfo(project).subscribe(data => {
            this.onClickRefreshProject();
        });
    }

    onExamineProject(project) {
        localStorage.setItem('projectName', JSON.stringify(project.name));
        this._router.navigate(['/pages/watchProject']);
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

