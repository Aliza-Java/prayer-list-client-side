import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            // Checking if it is an Authentication Error (401)
            if (error.status === 401) {
                this.router.navigate([`guest`]);
                return throwError(error.message);  //The message is what will be thrown to the Observable, which will show it in alert
            }
            // If it is not an authentication error, just throw it
            return throwError(error);//The message is what will be thrown to the Observable, which will handle it according to specifications
        }));
    }
}
