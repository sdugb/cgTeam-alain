import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectService } from '../project.service';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myTasks',
    templateUrl: './mySoftwares.component.html'
    //styleUrls: ['./myTasks.component.less']
})

export class MySoftwaresComponent implements OnInit {
    userName: String;
    constructor(
        private _localStorage: LocalStorage,
        private _projectService: ProjectService,
        private msg: NzMessageService,
        private _router: Router) {}

    ngOnInit() {
        console.log('ngOnInit');

    }
}
