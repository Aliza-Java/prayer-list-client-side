import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Signin } from 'src/app/shared/models/signin.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    loading = false;
    adminLogin:Signin = null;
    constructor(public httpService: HttpService, public router: Router, public daveningService: DaveningService) { }

    public getToken(): string {
        return localStorage.getItem('token');
    }

    public login(email: string, password: string) {
        this.loading = true;
        this.httpService.login(email, password).subscribe(response => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", response.token);
            this.adminLogin.email = response.email;
            this.adminLogin.id = response.id;
            this.loading = false;
            this.router.navigate(['admin/']);
        },
            error => {
                if (error.error.code == "NOT_ADMIN_EMAIL") {
                    this.daveningService.errorMessage = "Check your email and password again. ";
                }
                console.log(error);
                this.loading = false;
            });
    }

    public logout(){
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        this.adminLogin = null;
    }
}