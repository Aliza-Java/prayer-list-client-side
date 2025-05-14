import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { AuthService } from '../auth.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    loginForm: UntypedFormGroup = new UntypedFormGroup({});

    constructor(public daveningService: DaveningService,
        public adminService: AdminService,
        public authService: AuthService,
        public router: Router) { }

    ngOnInit() {
        this.loginForm = new UntypedFormGroup({
            'email': new UntypedFormControl(null, [Validators.required, Validators.email]),
            'password': new UntypedFormControl(null, Validators.required)
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(
                this.loginForm.value['email'],
                this.loginForm.value['password']
            ).subscribe({
                next: () => {
                    // Wait until this point to say we're logged in
                    this.authService.loggedIn.next(true);
                    this.router.navigate(['admin']);
                },
                error: () => {
                    this.daveningService.setErrorMessage("Please check your email and password again.");
                }
            });
        }
    }
}
