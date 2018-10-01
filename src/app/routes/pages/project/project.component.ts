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
    selector: 'app-pages-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css'],
    providers: [ LocalStorage ]
})

export class ProjectComponent implements OnInit {
    validateForm: FormGroup;
    userName: String;
    templateList: any = [];
    designToolList: any = [];
    renderList: any = [];
    timeUnitList: any = [];
    xResolution: number;
    yResolution: number;
    render: String;
    timeUnit: String;
    designTool: String;

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
        this.designToolList = ['maya 2014', 'maya 2015', 'maya 2016', 'maya 2017', 'maya 2018'];
        this.renderList = ['arnold', 'redshift', '3dmax', 'software', 'hardware', 'renderwing'];

        this.timeUnitList = ['game: 15fps',
            'film: 24fps',
            'pal: 25fps',
            'ntsc: 30fps',
            'show: 48fps',
            'palf: 50fpa',
            'ntscf: 60fps'];
        this.designTool = 'maya 2014'
        this.render = 'arnold';
        this.timeUnit = 'pal: 25fps';
        this.xResolution = 1920;
        this.yResolution = 1280;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }

        this.userName = currentUser.username;
        this._teamService.getMyTemplates(this.userName).subscribe(data => {
            this.templateList = data;
            this._projectService.getAllProjects().subscribe(data1 => {

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
            alias            : [ null ],
            designTool       : [ null ],
            render           : [ null ],
            template         : [ null ],
            timeUnit         : [ null ],
            xResolution      : [ null ],
            yResolution      : [ null ]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateProject() {
        const name = this.getFormControl('name').value;
        const alias = this.getFormControl('alias').value;
        const designTool = this.getFormControl('designTool').value;
        const render = this.getFormControl('render').value;
        const timeUnit = this.getFormControl('timeUnit').value;
        const xResolution = this.getFormControl('xResolution').value;
        const yResolution = this.getFormControl('yResolution').value;
        const team = JSON.parse(localStorage.getItem('teamName'));
        const templateName = this.getFormControl('template').value;
        let templateStage = '';
        for (const temp of this.templateList) {
            if (templateName === temp.name) {
                templateStage = temp.stage;
                break;
            }
        }
        const project = {name: name,
            user: this.userName,
            team: team,
            templateName: templateName,
            templateStage: templateStage,
            alias: alias,
            designTool: designTool,
            render: render,
            timeUnit: timeUnit,
            xResolution: xResolution,
            yResolution: yResolution,
            enable: true,
            type: false
        };
        this._projectService.createProject(project).subscribe(data => {
            this._router.navigate(['function/myProjects']);
            this.msg.success('done');
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }
}
