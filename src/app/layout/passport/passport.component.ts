import { Component} from '@angular/core';
import { LocalStorage } from '../../core/local.storage';
import { Router } from '@angular/router';
import { ProjectService } from '../../routes/function/project.service';

@Component({
    selector: 'layout-passport',
    templateUrl: './passport.component.html',
    styleUrls: ['./passport.component.less'],
    providers: [ LocalStorage ]
})
export class LayoutPassportComponent {
    title: String;
    links = [
        {
            title: '帮助',
            href: ''
        },
        {
            title: '隐私',
            href: ''
        },
        {
            title: '条款',
            href: ''
        }
        ];

    constructor(
        private _localStorage: LocalStorage,
        private _projectService: ProjectService,
        private _router: Router) {
        this._projectService.getTeam().subscribe(team => {
            console.log(team);
            localStorage.setItem('currentTeam', JSON.stringify(team));
            this.title = team.alias;
        });
    }
}
