import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject } from 'rxjs';
import { Signin } from 'src/app/shared/models/signin.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
    providedIn: 'root' /*note if there are problems: Using providedIn: 'any' for an @Injectable or InjectionToken is deprecated in v15*/
})
export class AuthService {
    adminLogin: Signin;
    loggedIn = new Subject<boolean>();

    constructor(
        public httpService: HttpService,
        public router: Router,
        public daveningService: DaveningService) {
        this.adminLogin = new Signin();
    }

    public getToken(): string {
        return localStorage.getItem("token") || '';
    }

    public login(email: string, password: string) {
        this.daveningService.setLoading(true);
        this.httpService.login(email, password).pipe(finalize(() => this.daveningService.setLoading(false))).subscribe(response => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", response.token || '');
            localStorage.setItem("email", response.email || '');
            this.adminLogin.setEmail(localStorage.getItem("email") || '');
            this.loggedIn.next(true);
            this.adminLogin.setId(response.id || 0);
            this.router.navigate(['admin']);
            this.daveningService.serverFine = true;
        },
            error => {
                if (error.status === 0)
                    {
                        this.daveningService.setErrorMessage('The server seems to be down... please contact technical support');
                        this.daveningService.serverFine = false;
                    }
                    else
                        this.daveningService.setErrorMessage("Please check your email and password again. ");              
            });
    }

    public logout() {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        this.adminLogin = new Signin();
        this.router.navigate(['admin']);
    }
}