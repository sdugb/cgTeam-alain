import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { ProjectService } from '../../function/project.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../core/local.storage';

@Component({
    selector: 'app-pages-subProject',
    templateUrl: './subProject.component.html',
    providers: [ LocalStorage ]
    // styleUrls: ['./subProject.component.css'],
})

export class SubProjectComponent implements OnInit {
    validateForm: FormGroup;
    userName: String;
    projectName: String;
    teamList: any = [];
    templateList: any = [];
    title: String;
    error: String;

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
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
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
        this.projectName = JSON.parse(localStorage.getItem('currentProject'));
        this.title = '项目:' + this.projectName + '分包';
        this._projectService.getTeam().subscribe(data => {
            this.teamList = data;
            this._projectService.getMyTemplates(this.userName).subscribe(data1 => {
                this.templateList = data1;
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
            team             : [ null ],
            template         : [ null ]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onTest() {
        const DAMurl = this.getFormControl('url').value;
        const user = this.getFormControl('user').value;
        const apiKey = this.getFormControl('apiKey').value;
        this._projectService.testDAMServer(DAMurl, apiKey).subscribe(data => {
            console.log('data =', data[0][1]);
            if (user === data[0][2]) {
                this.msg.success('done');
            } else {

            }

        });
    }

    onCreateSubProject() {
        const name = this.getFormControl('name').value;
        const team = this.getFormControl('team').value;
        const templateName = this.getFormControl('template').value;
        let templateStage = '';
        for (const temp of this.templateList) {
            if (templateName === temp.name) {
                templateStage = temp.stage;
                break;
            }
        }
        const user = this.getFormControl('user').value;
        const subProject = {  user: this.userName,
            name: name,
            team: team,
            project: this.projectName,
            templateName: templateName,
            templateStage: templateStage}
        console.log('subProject =', subProject);
        this._projectService.createProject(subProject).subscribe(data => {
            this._router.navigate(['function/myProjects']);
            this.msg.success('done');
        });

    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }
}
