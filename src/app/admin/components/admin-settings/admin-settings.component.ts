import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminSettings } from 'src/app/shared/models/admin-settings.model';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
    settingsForm: FormGroup;
    settings: AdminSettings = null;
    settingsUpdatedSub: Subscription = null;
    constructor(public adminService: AdminService, public router: Router, public authService: AuthService) { }

    ngOnInit() {
        this.settings = this.adminService.adminSettings;
        debugger;
        this.populateSettingsForm();
        this.settingsUpdatedSub = this.adminService.settingsUpdated.subscribe(adminSettings => {
            this.settings = adminSettings;
            this.populateSettingsForm();
        });
    }

    populateSettingsForm() {
        this.settingsForm = new FormGroup({
            'email': new FormControl(this.settings.email, [Validators.required, Validators.email]),
            'prompt': new FormControl(this.settings.newNamePrompt),
            'wait': new FormControl(this.settings.waitBeforeDeletion)
        });
    }

    onSubmit() {
        this.adminService.editSettings(this.settings);
    }

    onCancel() {
        this.router.navigate(['admin/names']);
    }

    ngOnDestroy() {
        if (this.settingsUpdatedSub)
            this.settingsUpdatedSub.unsubscribe();
    }
}