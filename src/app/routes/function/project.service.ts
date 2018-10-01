import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class ProjectService {
    constructor (private http: _HttpClient) {
    }

    getTeam() {
        return this.http
            .post('cgteam/getTeam')
            .pipe(catchError(this.handleError));
    }

    createTask(task) {
        return this.http
            .post('cgteam/createTask', {'task': task})
            .pipe(catchError(this.handleError));
    }

    getProjectInfo(projectName) {
        return this.http
            .post('cgteam/getProjectInfo', {'name': projectName})
            .pipe(catchError(this.handleError));
    }

    getCompleteProjects() {
        return this.http
            .post('cgteam/getCompleteProjects')
            .pipe(catchError(this.handleError));
    }

    getAllProjects() {
        return this.http
            .post('cgteam/getAllProjects')
            .pipe(catchError(this.handleError));
    }

    getProjects(user) {
        return this.http
            .post('cgteam/getMyProjects', {'user': user})
            .pipe(catchError(this.handleError));
    }

    getMyTasks(user) {
        return this.http
            .post('cgteam/getMyTasks', {user: user})
            .pipe(catchError(this.handleError));
    }

    getMyCheckinTasks(user) {
        return this.http
            .post('cgteam/getMyCheckinTasks', {user: user})
            .pipe(catchError(this.handleError));
    }

    getMyFinishedTasks(user) {
        return this.http
            .post('cgteam/getMyFinishedTasks', {user: user})
            .pipe(catchError(this.handleError));
    }

    deleteTask(task) {
        return this.http
            .post('cgteam/deleteTask', {task: task})
            .pipe(catchError(this.handleError));
    }

    GetTasksOfProject(projectName) {
        return this.http
            .post('cgteam/GetTasksOfProject', {projectName: projectName})
            .pipe(catchError(this.handleError));
    }

    GetTasksOfProjectWithIcon(projectName) {
        return this.http
            .post('cgteam/GetTasksOfProjectWithIcon', {projectName: projectName})
            // .post('cgteam/GetTasksOfProject', {projectName: projectName})
            .pipe(catchError(this.handleError));
    }

    submitTask(task_id) {
        return this.http
            .post('cgteam/submitTask', {id: task_id})
            .pipe(catchError(this.handleError));
    }

    unSubmitTask(task_id) {
        return this.http
            .post('cgteam/unSubmitTask', {id: task_id})
            .pipe(catchError(this.handleError));
    }

    uploadExcelFiles(projectName, modelProjectName, stage, table) {
        console.log('table =', table);
        return this.http
            .post('cgteam/uploadExcelFiles', {projectName: projectName, modelProjectName: modelProjectName,
                stage: stage, table: table})
            .pipe(catchError(this.handleError));
    }

    setTaskInfo(task) {
        return this.http
            .post('cgteam/setTaskInfo', {task: task})
            .pipe(catchError(this.handleError));
    }

    setTaskExecutor(task_id, executor) {
        return this.http
            .post('cgteam/setTaskExecutor', {id: task_id, executor: executor})
            .pipe(catchError(this.handleError));
    }

    setTaskCheckinor(task_id, checkinor) {
        return this.http
            .post('cgteam/setTaskCheckinor', {id: task_id, checkinor: checkinor})
            .pipe(catchError(this.handleError));
    }

    setTaskDiffcult(task_id, diffcult) {
        return this.http
            .post('cgteam/setTaskDiffcult', {id: task_id, diffcult: diffcult})
            .pipe(catchError(this.handleError));
    }

    setTaskStatus(task_id, isDone, isFinished) {
        return this.http
            .post('cgteam/setTaskStatus', {id: task_id, isDone: isDone, isFinished: isFinished})
            .pipe(catchError(this.handleError));
    }

    setTaskStage(task_id, stage) {
        return this.http
            .post('cgteam/setTaskStage', {id: task_id, stage: stage})
            .pipe(catchError(this.handleError));
    }

    setTaskAssetPath(task_id, assetPath) {
        return this.http
            .post('cgteam/setTaskAssetPath', {id: task_id, assetPath: assetPath})
            .pipe(catchError(this.handleError));
    }

    getSubmitFileListContent(fileIDList) {
        return this.http
            .post('cgteam/getSubmitFileListContent', {fileIDList: fileIDList})
            .pipe(catchError(this.handleError));
    }

    getSubmitMovFile(name, movID) {
        return this.http
            .post('cgteam/getSubmitMovFile', {name: name, movID: movID})
            .pipe(catchError(this.handleError));
    }

    getTeamMember() {
        return this.http
            .post('RC/getTeamMember')
            .pipe(catchError(this.handleError));
    }

    deleteProject(projectName) {
        return this.http
            .post('RC/deleteProject', {projectName: projectName})
            .pipe(catchError(this.handleError));
    }

    createProject(project) {
        return this.http
            .post('cgteam/createProject', {project: project})
            .pipe(catchError(this.handleError));
    }

    getMyTemplates(user) {
        return this.http
            .post('RC/getMyTemplates', {'user': user})
            .pipe(catchError(this.handleError));
    }

    testDAMServer(url, apiKey) {
        return this.http
            .post('RC/testDAMServer', {'url': url, 'apiKey': apiKey})
            .pipe(catchError(this.handleError));
    }

    setProjectInfo(project) {
        return this.http
            .post('cgteam/setProjectInfo', {projectName: project.name, enable: project.enable,
                        designTool: project.designTool, render: project.render})
            .pipe(catchError(this.handleError));
    }

    setProjectRender(project, render) {
        return this.http
            .post('cgteam/setProjectRender', {projectName: project.name, render: render})
            .pipe(catchError(this.handleError));
    }

    setProjectDesignTool(project, designTool) {
        return this.http
            .post('cgteam/setProjectDesignTool', {projectName: project.name, designTool: designTool})
            .pipe(catchError(this.handleError));
    }


    SetTaskRenderFrames(taskID, frameList) {
        return this.http
            .post('cgteam/setTaskRenderFrames', {taskID: taskID, singleFrameList: '', frameList: frameList})
            .pipe(catchError(this.handleError));
    }

    RenderJobSubmit(teamName, userName, renderJobName, taskList) {
        return this.http
            .post('rest/renderJobSubmit_py', {teamName: teamName, userName: userName, renderJobName: renderJobName,
                taskList: JSON.stringify(taskList), renderType: 'sequence'})
            .pipe(catchError(this.handleError));
    }

    GetAninmationFile(projectName, assetID) {
        return this.http
            .post('cgteam/getAnimationFile', {projectName: projectName, assetID: assetID})
            .pipe(catchError(this.handleError));
    }

    GetTaskIconURL(URLFileID) {
        return this.http
            .post('cgteam/getTaskIconURL', {URLFileID: URLFileID})
            .pipe(catchError(this.handleError));
    }

    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.log('handleError =', error);
        return Observable.throw(error || "Server Error");
    }
}
