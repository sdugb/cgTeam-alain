import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {equalSegments} from '@angular/router/src/url_tree';
import {elementStart} from '@angular/core/src/render3/instructions';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const url = request.url;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (url.split('/')[0] === 'cgserver') {
            if (userInfo && userInfo.token) {
                request = request.clone({setHeaders: {Authorization: `JWT ${userInfo.token}`}});
            }
        } else {
            if (userInfo && userInfo.teamToken) {
                // const teamInfo = userInfo.team;
                // const apiUrl = teamInfo.apiUrl + '/' + request.url;
                // console.log(apiUrl);
                // request = request.clone({url: apiUrl, setHeaders: {Authorization: `JWT ${userInfo.teamToken}`}});
                request = request.clone({setHeaders: {Authorization: `JWT ${userInfo.teamToken}`}});
                // console.log('request =', request);
            }
        }
        return next.handle(request);
    }
}
