import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    loginForm: UntypedFormGroup = new UntypedFormGroup({});

    constructor(public httpService:HttpService, public adminService:AdminService, public authService:AuthService) { }

    ngOnInit() {
        this.loginForm = new UntypedFormGroup({
            'email': new UntypedFormControl(null,[Validators.required, Validators.email]),
            'password': new UntypedFormControl(null, Validators.required)
        });
    }

    onSubmit(){
        this.authService.login(this.loginForm.value['email'], this.loginForm.value['password']);
    }

}
