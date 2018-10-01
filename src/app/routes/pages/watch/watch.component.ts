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
    templateUrl: './watch.component.html',
    providers: [ LocalStorage ]
})

export class WatchComponent implements OnInit {
    project: any;
    submitFileList: any = [];
    submitFile: String;
    taskList: any = [];
    taskName: String;

    constructor(private _projectService: ProjectService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {
        this.submitFileList = [];
        this.taskName = JSON.parse(localStorage.getItem('taskName'));
        const movID = JSON.parse(localStorage.getItem('submitMovID'));
        console.log('taskName =', this.taskName);
        this.submitFile = 'http://211.87.224.168:3600/file/' + this.taskName + '.mov';
        /*
        this._projectService.getSubmitMovFile(this.taskName, movID).subscribe(data => {
            console.log(data);
            if (data.status === 0)
                this.submitFile = 'http://211.87.224.168:3000/' + data.file;
            console.log(this.submitFile);
        });
        */
    }

    ngOnInit() {
        const projectName = this._localStorage.getObject('projectName');
        this._projectService.GetTasksOfProject(projectName).subscribe(data2 => {
                this.taskList = data2;
            });
    }

    onClickBack () {
        this._router.navigate(['function/myProjects']);
    }

    onClickSelectTask(task) {

    }

}
