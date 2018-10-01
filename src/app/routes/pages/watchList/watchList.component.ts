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
    templateUrl: './watchList.component.html',
    providers: [ LocalStorage ]
})

export class WatchListComponent implements OnInit {
    project: any;
    submitFileList: any = [];
    submitFile: String;
    taskList: any = [];
    taskName: String;
    listFlag: Boolean;
    taskTotal: Number;
    picValue: Buffer;

    constructor(private _projectService: ProjectService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {
        this.submitFileList = [];
        const fileIDList = JSON.parse(localStorage.getItem('fileIDList'));
        this._projectService.getSubmitFileListContent(fileIDList).subscribe(data2 => {
            for (let i = 0; i < data2.length; i++) {
                const submitFile = data2[i];
                data2[i].picValue = 'data:image/png;base64,' + data2[i].content;
                this.submitFileList = [ ...this.submitFileList, {
                    key    : i,
                    name: submitFile.filename,
                    picValue: 'data:image/png;base64,' + submitFile.content
                }];
            }
            this.listFlag = true;
            this.submitFileList = data2;
            this.taskTotal = data2.length;
        });
    }

    ngOnInit() {

    }

    onClickBack1 () {
        this._router.navigate(['function/myCheckinTasks']);
    }

    onClickBack2 () {
        this.listFlag = true;
    }

    onWatch(fileID) {
        this.listFlag = false;
        this.picValue = fileID.picValue;
    }
}
