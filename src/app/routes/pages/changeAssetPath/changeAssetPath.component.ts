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
    templateUrl: './changeAssetPath.component.html'
})

export class ChangeAssetPathComponent implements OnInit {
    validateForm: FormGroup;
    task_id = '';
    assetPath = '';

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
                private _projectService: ProjectService,
                private _localStorage: LocalStorage,
                private _router: Router) {
        this.task_id = _localStorage.getObject('taskID');
        this.assetPath = _localStorage.getObject('taskAssetPath');
        console.log(this.assetPath);
        console.log(this.task_id);
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
            assetPath        : [ this.assetPath, [ Validators.required ] ]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onSubmit() {
        const assetPath = this.getFormControl('assetPath').value;

        this._projectService.setTaskAssetPath(this.task_id, assetPath).subscribe(data => {
            this._router.navigate(['function/myProjects']);
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }

}
