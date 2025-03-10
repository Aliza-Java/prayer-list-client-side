import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor() { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!(localStorage.getItem("isLoggedIn") && localStorage.getItem("token"))) {
            return next.handle(req);
        }
        else {
            const modifiedReq = req.clone({
                params: new HttpParams().set('Authorization', localStorage.getItem('token')??0)
            });
            return next.handle(modifiedReq);
        }
    }
}