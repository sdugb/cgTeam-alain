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
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../core/local.storage';

@Component({
    selector: 'app-pages-modifyPassword',
    templateUrl: './modifyPassword.component.html'
})

export class ModifyPasswordComponent implements OnInit {
    validateForm: FormGroup;
    srcPassword = '';
    password1 = '';
    password2 = '';
    userName: String;
    teamName: String;

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
                private msg: NzMessageService,
                private _teamService: TeamService,
                private _localStorage: LocalStorage,
                private _router: Router) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/']);
            return;
        }
        this.userName = currentUser.username;
        this.teamName = JSON.parse(localStorage.getItem('teamName'));
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
            srcPassword      : [ null, [ Validators.required ] ],
            password1        : [ null, [ Validators.required ] ],
            password2        : [ null, [ Validators.required ] ]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onSubmit() {
        const srcPassword = this.getFormControl('srcPassword').value;
        const password1 = this.getFormControl('password1').value;
        const password2 = this.getFormControl('password2').value;
        if (password1 !== password2) {
            this.msg.warning('两次密码输入不对（消息将于10秒后消失）', {nzDuration: 10000});
        }

        this._teamService.modifyPassword(this.userName, this.teamName, srcPassword, password1).subscribe(data => {
            if (data.status === 1) {
                console.log(data.message);
                return;
            }
            this._router.navigate(['function/myProjects']);
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }

}
