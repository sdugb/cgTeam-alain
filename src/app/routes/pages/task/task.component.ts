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
    selector: 'app-pages-task',
    templateUrl: './task.component.html',
    providers: [ LocalStorage ]
    // styleUrls: ['./project.component.css'],
})

export class TaskComponent implements OnInit {
    validateForm: FormGroup;
    teamName: String;
    projectName: String;
    name: String;
    stage: String;
    diffcult: String;
    modelClass: String;
    modelType; String;
    executor: String;
    checkinor: String;
    stageList: any = [];
    userList: any= [];
    project: any = {};
    _dateRange = [null, null];
    modelFlag = false;
    assetPath = null;

    diffcultList = ['A', 'B', 'C', 'D', 'E'];
    classList = ['角色', '场景', '道具', '灯光', '其他'];

    current = 0;
    index = 'First-content';

    pre() {
        this.current -= 1;
        this.changeContent();
    }

    next() {
        this.current += 1;
        this.changeContent();
    }

    changeContent() {
        switch (this.current) {
            case 0: {
                this.index = 'First-content';
                break;
            }
            case 1: {
                this.index = 'Second-content';
                break;
            }
            case 2: {
                this.index = 'Third-content';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
                private _teamService: TeamService,
                private _projectService: ProjectService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {
        this.teamName = JSON.parse(localStorage.getItem('teamName'));
        this.projectName = JSON.parse(localStorage.getItem('projectName'));
        if (!this.projectName)
            this._router.navigate(['/function/myProjects']);
        this.teamName = JSON.parse(localStorage.getItem('teamName'));

        console.log('teamName =', this.teamName);
        this._teamService.getTeamMember(this.teamName).subscribe(data1 => {
            console.log('data1 =', data1);
            this.userList = data1;
            this._projectService.getProjectInfo(this.projectName).subscribe(data2 => {
                console.log('data2 =', data2);
                this.project = data2[0];
                this.stageList = this.project.templateStage.split(',');
                if (this.project.templateName === '3DAsset')
                    this.modelFlag = true;
                else
                    this.modelFlag = false;
                console.log(this.project.templateStage);
                console.log(this.stageList);

            });
        });
    }

    updateConfirmValidator() {
        /** wait for refresh value */

    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        }
    }

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            name             : [ null, [ Validators.required ] ],
            projectName      : [ null ],
            diffcult         : [ null ],
            modelClass       : [ null ],
            modelType        : [ null, null ],
            stage            : [ null ],
            assetPath        : [ null ],
            executor         : [ null ],
            checkinor        : [ null ],
            _dateRange       : [ null, null]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateTask() {
        this.projectName = JSON.parse(localStorage.getItem('projectName'));
        let str = '';
        if (this.modelClass === '角色')
            str = 'chr_';
        else if (this.modelClass === '道具')
            str = 'pro_';
        else if (this.modelClass === '场景')
            str = 'loc_';
        else if (this.modelClass === '其他')
            str = 'oth_';
        if (this.name.indexOf(str) < 0)
            this.name = str + this.name;

        const task = {name: this.name,
            projectName: this.projectName,
            stage: this.stage,
            diffcult: this.diffcult,
            modelClass: this.modelClass,
            modelType: this.modelType,
            executor: this.executor,
            checkinor: this.checkinor,
            assetPath: this.assetPath,
            startdate: this._dateRange[0],
            duedate: this._dateRange[1]
        };
        console.log('task =', task);

        this._projectService.createTask(task).subscribe(data => {
            if (data.status === 1) {
                console.log('error =', data.message);
                return;
            }
            this._router.navigate(['function/myProjects']);
            this.msg.success('done');
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }
}
