import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, map, Observable, Subject, tap, throwError } from 'rxjs';
import { JwtPayload } from 'src/app/shared/models/jwt-payload';
import { JwtResponse } from 'src/app/shared/models/jwt-response';
import { Signin } from 'src/app/shared/models/signin.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
    providedIn: 'root' /*note if there are problems: Using providedIn: 'any' for an @Injectable or InjectionToken is deprecated in v15*/
})
export class AuthService {
    adminLogin: Signin;
    loggedIn = new Subject<boolean>();
    private accessToken: string | null = null;

    constructor(
        public http: HttpClient, //todo in future - change to httpService and check that still works
        public httpService: HttpService,
        public router: Router,
        public daveningService: DaveningService) {
        this.adminLogin = new Signin();
        const token = localStorage.getItem('accessToken');
        if (token) {
            const email = this.getEmailFromToken(token);
            if (email != null) {
                this.loggedIn.next(true);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("email", email || '');
                this.adminLogin.setEmail(email);
            }
        }
    }

    getEmailFromToken(token: string) {
        // 1. split into [header, payload, signature]
        const payloadBase64 = token.split('.')[1];
        // 2. atob to get JSON string, then parse
        const json = atob(payloadBase64);
        const jwtPayload: JwtPayload = JSON.parse(json);
        const email = jwtPayload.sub;
        const exp = new Date(jwtPayload.exp * 1000);
        console.log('email:', email);
        console.log('expires at:', exp);
        if (exp.getTime() < new Date().getTime()) {
            console.log('Access token has expired');
            return null;
        }
        return email;
    }

    public getAccessToken(): string | null {
        return this.accessToken || localStorage.getItem('accessToken');
    }

    setAccessToken(token: string, email: string, id: number) {
        this.accessToken = token;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", email || '');
        this.adminLogin.setEmail(email || '');
        this.loggedIn.next(true);
        this.adminLogin.setId(id || 0);
        this.daveningService.serverFine = true;
    }

    refreshToken(): Observable<string> {
        if (this.daveningService.loading()) {
            return EMPTY as Observable<string>;
        }
        this.daveningService.loading.set(true);

        //withCredentials tells the front end to send the cookie it has forward, so the refresh gets sent (front end doesn't see or handle it)
        const refresh$ = this.http.post<JwtResponse>('http://localhost:8080/dlist/auth/refresh', {}, {
            withCredentials: true
        }).pipe(finalize(() => this.daveningService.loading.set(false)),
            tap((res: JwtResponse) => {
                this.setAccessToken(res.token ?? '', res.email ?? '', res.id ?? 0);
            }),
            map((res: JwtResponse) => res.token),
            catchError((err): Observable<string> => {
                this.logout();
                return throwError(() => err);
            })
        );
        return refresh$ as Observable<string>;
    }

    public login(email: string, password: string) {
        return this.httpService.login(email, password).pipe(
            finalize(() => this.daveningService.loading.set(false)),
            tap(response => {
                this.setAccessToken(response.token ?? '', response.email ?? '', response.id ?? 0);
                this.adminLogin.setEmail(response.email || '');
                this.adminLogin.setId(response.id || 0);
                this.daveningService.serverFine = true;
                this.router.navigate(['admin']);
            })
        );
    }

    public logout() {
        localStorage.clear();
        this.adminLogin = new Signin();
        this.router.navigate(['admin']);
    }
}