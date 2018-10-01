"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/materialize");
require("rxjs/add/operator/dematerialize");
var FakeBackendInterceptor = /** @class */ (function () {
    function FakeBackendInterceptor() {
    }
    FakeBackendInterceptor.prototype.intercept = function (request, next) {
        var testUser = { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' };
        // wrap in delayed observable to simulate server api call
        return Observable_1.Observable.of(null).mergeMap(function () {
            // authenticate
            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                if (request.body.username === testUser.username && request.body.password === testUser.password) {
                    // if login details are valid return 200 OK with a fake jwt token
                    return Observable_1.Observable.of(new http_1.HttpResponse({ status: 200, body: { token: 'fake-jwt-token' } }));
                }
                else {
                    // else return 400 bad request
                    return Observable_1.Observable.throw('Username or password is incorrect');
                }
            }
            // get users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return Observable_1.Observable.of(new http_1.HttpResponse({ status: 200, body: [testUser] }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return Observable_1.Observable.throw('Unauthorised');
                }
            }
            // pass through any requests not handled above
            return next.handle(request);
        })
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .materialize()
            .delay(500)
            .dematerialize();
    };
    FakeBackendInterceptor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], FakeBackendInterceptor);
    return FakeBackendInterceptor;
}());
exports.FakeBackendInterceptor = FakeBackendInterceptor;
exports.fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: http_1.HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
//# sourceMappingURL=fake-backend.js.map