import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Admin } from 'src/app/shared/models/admin.model';
import { AdminService } from '../admin.service';

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
    settingsForm: FormGroup;
    admin: Admin = null;
    constructor(public adminService: AdminService) { }

    ngOnInit() {
        this.admin = this.adminService.adminLogin;
        this.settingsForm = new FormGroup({
            'email': new FormControl(this.admin.email, [Validators.required, Validators.email]),
            'prompt': new FormControl(this.admin.newNamePrompt),
            'wait': new FormControl(this.admin.waitBeforeDeletion)
        });
    }

    onSubmit(){
        alert('submitted!  Now make the changes on the DB!');
    }
}