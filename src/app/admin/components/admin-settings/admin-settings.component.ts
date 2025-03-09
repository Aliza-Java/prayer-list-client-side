import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
    settingsForm: UntypedFormGroup = new UntypedFormGroup({});
    prompt: boolean = false;
    wait: number = 7;
    settingsUpdatedSub: Subscription = new Subscription;
    
    constructor(public adminService: AdminService, public router: Router, public authService: AuthService) { }

    async ngOnInit() {
        this.adminService.populateAdminSettings();
        this.populateSettingsForm();

        this.settingsUpdatedSub = this.adminService.settingsUpdated.subscribe(adminSettings => {
            this.prompt = adminSettings.newNamePrompt ?? false;
            this.wait = adminSettings.waitBeforeDeletion ?? 7;
        });
    }

    populateSettingsForm() {
        this.settingsForm = new UntypedFormGroup({
            'prompt': new UntypedFormControl(this.adminService.adminSettings.newNamePrompt),
            'wait': new UntypedFormControl(this.adminService.adminSettings.waitBeforeDeletion)
        });
    }

    onSubmit() {
        this.adminService.editSettings(this.adminService.adminSettings.email ?? '', this.prompt, this.wait);
    }

    onCancel() {
        this.router.navigate(['admin/names']);
    }

    ngOnDestroy() {
        if (this.settingsUpdatedSub)
            this.settingsUpdatedSub.unsubscribe();
    }
}