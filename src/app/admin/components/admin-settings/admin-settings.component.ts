import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSettings } from 'src/app/shared/models/admin-settings.model';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
    settingsForm: FormGroup;
    settings: AdminSettings = null;
    constructor(public adminService: AdminService, public router:Router, public authService:AuthService) { }

    ngOnInit() {
        this.settings = this.adminService.adminSettings;
        this.adminService.settingsUpdated.subscribe(response=>{
            this.settingsForm = new FormGroup({
                'email': new FormControl(response.email, [Validators.required, Validators.email]),
                'prompt': new FormControl(response.newNamePrompt),
                'wait': new FormControl(response.waitBeforeDeletion)
            });
        });
        
    }

    onSubmit(){
        let updatedSettings:AdminSettings;
        updatedSettings.email = this.settingsForm.get('email').value;
        updatedSettings.newNamePrompt = this.settingsForm.get('prompt').value;
        updatedSettings.waitBeforeDeletion = this.settingsForm.get('wait').value;
        this.adminService.editSettings(updatedSettings);
    }

    onCancel(){
        this.router.navigate(['admin/names']);
    }
}