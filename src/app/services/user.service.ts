import { Injectable, Inject } from '@angular/core';
//import { Control } from '@angular/common';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class UserService {
    constructor (private http: Http, @Inject('apiBase') private _apiBase: string) {

    }

    register(user) {
        console.log(user);
        let userInfo = {'username': user.username, 'password': user.password, 'email': user.email};
        let body = JSON.stringify(userInfo);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        let url = '/cgserver/register';
        return this.http.post(url, body, <RequestOptionsArgs> {headers: headers, withCredentials: true})
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        return Observable.throw(error || "Server Error");
    }
}
