import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class PlatformUserService {
    getUsers() {
        return this.http
            .get('platform/users')
            .pipe(catchError(this.handleError));
    }


    getUserApps(systemID) {
        let url = 'platform/user/' + systemID + '/apps';
        return this.http
            .get(url)
            .pipe(catchError(this.handleError));
    }

    handleError(error: any) {
        console.log('handleError:', error);
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error('errMsg =', errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    constructor(private http: _HttpClient) {
    }
}
