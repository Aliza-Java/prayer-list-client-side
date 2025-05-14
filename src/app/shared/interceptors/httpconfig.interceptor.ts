import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {            
            if (error.status === 0) {
                this.router.navigate(['down']);
                return throwError(error.message);
            }
            else
                // If it is not an authentication error, just throw it
                return throwError(error);//The message is what will be thrown to the Observable, which will handle it according to specifications
        }));
    }
}
