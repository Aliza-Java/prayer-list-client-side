import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(public httpService:HttpService) { }

    ngOnInit() {
        this.loginForm = new FormGroup({
            'email': new FormControl(null,[Validators.required, Validators.email]),
            'password': new FormControl(null, Validators.required)
        });
    }

    onSubmit(){
        this.httpService.login(this.loginForm.value['email'], this.loginForm.value['password']);
    }

}
