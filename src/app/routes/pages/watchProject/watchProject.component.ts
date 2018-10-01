import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { TeamService } from '../../function/team.service';
import { ProjectService } from '../../function/project.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../core/local.storage';

@Component({
    selector: 'app-pages-watch',
    templateUrl: './watchProject.component.html',
    providers: [ LocalStorage ]
})

export class WatchProjectComponent implements OnInit {
    videoList: any = [];
    taskList: any = [];

    constructor(private _projectService: ProjectService,
                private _teamService: TeamService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {
    }

    ngOnInit() {
        const projectName = this._localStorage.getObject('projectName');
        const teamName = this._localStorage.getObject('teamName');
        if (!teamName) {
            this._router.navigate(['/']);
        }
        this._teamService.getTeamInfo(teamName).subscribe(data1 => {
            // const url = 'http://211.87.224.168:3600/file/';
            console.log('data1 =', data1);
            const url = data1[0].apiUrl + '/file/';
            this._projectService.GetTasksOfProject(projectName).subscribe(data2 => {
                this.taskList = data2;
                console.log(data2);
                const count = data2.length;
                let submitID1 = '';
                let submitID2 = '';
                let submitID3 = '';
                let name1 = '';
                let name2 = '';
                let name3 = '';
                for (let i = 0; i < count; i = i + 2) {
                    if (i + 2 < count) {
                        submitID1 = this.taskList[i].name + '.mov';
                        submitID2 = this.taskList[i + 1].name + '.mov';
                        submitID3 = this.taskList[i + 2].name + '.mov';
                        name1 = this.taskList[i].name;
                        name2 = this.taskList[i + 1].name;
                        name3 = this.taskList[i + 2].name;
                    } else if (i + 1 < count) {
                        submitID1 = this.taskList[i].name + '.mov';
                        submitID2 = this.taskList[i + 1].name + '.mov';
                        name1 = this.taskList[i].name;
                        name2 = this.taskList[i + 1].name;
                    } else if (i < count) {
                        submitID1 = this.taskList[i].name + '.mov';
                        name1 = this.taskList[i].name;
                    }

                    let url1 = '';
                    let url2 = '';
                    let url3 = '';
                    if (this.taskList[i].submitMovID)
                        url1 = url + submitID1;
                    if (this.taskList[i + 1].submitMovID)
                        url2 = url + submitID2;
                    if (this.taskList[i + 2].submitMovID)
                        url3 = url + submitID3;
                    this.videoList.push({
                        name1: name1, submitFile1: url1,
                        name2: name2, submitFile2: url2,
                        name3: name3, submitFile3: url3
                    });
                }
            });
        });
    }

    onClickBack () {
        this._router.navigate(['function/myProjects']);
    }

    onClickSelectTask(task) {

    }

}
