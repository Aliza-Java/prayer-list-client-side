import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, public router: Router, public daveningService: DaveningService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.authService.getAccessToken();

        if (accessToken) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` }
            });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log("arrived in auth-interceptor");
                console.log(error);
                if (error.status === 401) {
                    if (error.headers.get('Token-Expired') === 'true') {
                        console.log('Access token expired. Attempting refresh...');
                        return this.authService.refreshToken().pipe(
                            switchMap(newToken => {
                                const retryReq = req.clone({
                                    setHeaders: { Authorization: `Bearer ${newToken}` }
                                });
                                return next.handle(retryReq);
                            }),
                            catchError(() => {
                                this.daveningService.setErrorMessage("Session expired. Please log in again.", true);
                                this.authService.logout();
                                return throwError(() => error); // use original error object
                            })
                        );
                    } else {
                        // 401 but not due to token expiration
                        this.daveningService.setErrorMessage("Unauthorized access.", true);

                        const currentUrl = this.router.url;

                        //if receive an 'unauthorized', redirect to appropriate starting page
                        if (currentUrl.startsWith('/guest')) {
                            this.router.navigate(['/guest']);
                        } else if (currentUrl.startsWith('/admin')) {
                            this.router.navigate(['/admin']);
                        } else {
                            this.router.navigate(['/']); // default fallback
                        }

                        this.router.navigate([`admin`]);
                        return throwError(() => error);
                    }
                }

                // General error fallback
                const serverMessage =
                    error.error?.message ||
                    error.error?.error ||
                    "An unexpected error occurred.";

                this.daveningService.setErrorMessage(serverMessage);
                return throwError(() => error);
            })
        );
    }
}