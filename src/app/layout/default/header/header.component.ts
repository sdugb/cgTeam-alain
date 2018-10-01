import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { ProjectService } from '../../../routes/function/project.service';
import { LocalStorage } from '../../../core/local.storage';
import { EventService } from '../../../event.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    providers: [ LocalStorage ]
})

export class HeaderComponent {
    searchToggleStatus: boolean;
    projectList: any= [];
    projectName: String;
    teamAlias: String;

    constructor(public settings: SettingsService,
                public eventService: EventService,
                private _projectService: ProjectService,
                private _router: Router,
                private _localStorage: LocalStorage) {
        this.teamAlias = JSON.parse(localStorage.getItem('teamAlias'));
        if (!this.teamAlias) {
            this._router.navigate(['/']);
            return;
        }
    }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    searchToggleChange() {
        this.searchToggleStatus = !this.searchToggleStatus;
    }

    onRefreshProjectList() {
        this._projectService.getAllProjects().subscribe(data1 => {
                this.projectList = data1;
                this.projectName = this.projectList[0].name;
                this._localStorage.setObject('projectName', this.projectName);
            },
            error => {
                this.projectList = [];
                this.projectName = '';
                this._localStorage.setObject('projectName', '');
            });
    }

    onClickSelectProject(project) {
        console.log(project);
        this.projectName = project.name;
        this._localStorage.setObject('projectName', this.projectName);
        console.log('emit');
        this.eventService.change.emit(1);
    }
}
