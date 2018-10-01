import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient, } from '@delon/theme';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class PassportService {
    register(username, password, teamName) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let body = new HttpParams();
        body = body.set('username', username);
        body = body.set('password', password);
        body = body.set('team', teamName);
        body = body.set('role', 'designer');
        return this.http
            .post('cgserver/register', body, {headers: headers})
            .pipe(catchError(this.handleError));
    }

    login(username, password) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let body = new HttpParams();
        body = body.set('username', username);
        body = body.set('password', password);
        body = body.set('team', '');
        return this.http
            .post('cgteam/login', body, {headers: headers})
            .pipe(catchError(this.handleError));
    }

    getTeam() {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams();
        return this.http
            .post('cgteam/getTeam', body, {headers: headers})
            .pipe(catchError(this.handleError));
    }
    /*
    login(username, password) {
        const body = {'username': username, 'password': password};
        return this.http
            .post('cgserver/login', body)
            .pipe(catchError(this.handleError));
    }

    getUserInfo(username) {
        const body = {'userName': username};
        return this.http
            .post('cgserver/getUserInfo', body)
            .pipe(catchError(this.handleError));
    }

    getTeam() {
        return this.http
            .post('RC/getTeam')
            .pipe(catchError(this.handleError));
    }

    getUserApps(systemID) {
        const url = 'cgserver/login' + systemID + '/apps';
        return this.http
            .get(url)
            .pipe(catchError(this.handleError));
    }

    register(username, password) {
        console.log('register');
        const body = {'username': username, 'password': password, 'teamName': '', 'role': 'designer'};
        return this.http
            .post('cgserver/register', body)
            .pipe(catchError(this.handleError));
    }
*/
    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    constructor(private http: HttpClient) {
    }
}
