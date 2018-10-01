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
import { filter } from 'rxjs/operators/filter';
import { XlsxToJsonService } from './xlsx-to-json.service';

@Component({
    selector: 'app-pages-batchTask',
    templateUrl: './batchTask.component.html',
    providers: [ LocalStorage ]
    // styleUrls: ['./project.component.css'],
})

export class BatchTaskComponent implements OnInit {
    validateForm: FormGroup;
    userName: String;
    projectName: String;
    modelProjectName: String;
    name: String;
    stage: String;
    executor: String;
    checkinor: String;
    stageList: any = [];
    userList: any = [];
    project: any = {};
    _dateRange = [null, null];
    modelFlag = false;
    modelProjectList = [];
    result: any;

    private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();


    data: any;
    file: String;
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
                this.index = 'third-content';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
                private _teamService: TeamService,
                private _projectService: ProjectService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        this.userName = currentUser.username;
        this.projectName = JSON.parse(localStorage.getItem('projectName'));
        console.log('projectName =', this.projectName);
        console.log('userName =', this.userName);
        this._projectService.getCompleteProjects().subscribe(data => {
            console.log('data =', data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].templateName === '3DAsset')
                    this.modelProjectList.push(data[i]);
            }
            this._projectService.getProjectInfo(this.projectName).subscribe(data1 => {
                console.log('data1 =', data1);
                this.project = data1[0];
                this.stageList = this.project.templateStage.split(',');
            });
        });
    }

    updateConfirmValidator() {
        /** wait for refresh value */

    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {required: true};
        }
    }

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            projectName: [null],
            modelProjectName: [null],
            diffcult: [null],
            modelClass: [null],
            modelType: [null, null],
            stage: [null],
            executor: [null],
            checkinor: [null],
            _dateRange: [null, null]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    onCreateBatchTask() {
        console.log('onCreateBatchTask');
        console.log(this.projectName);
        console.log(this.modelProjectName);
        this._projectService.uploadExcelFiles(this.projectName, this.modelProjectName, this.stage, this.result).subscribe(data => {
            this._router.navigate(['function/myProjects']);
            this.msg.success('done');
        });
    }

    handleFile(event) {
        const file = event.target.files[0];
        // console.log('file =', file);
        this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
            this.result = JSON.stringify(data['sheets'].镜头表);
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }

}
