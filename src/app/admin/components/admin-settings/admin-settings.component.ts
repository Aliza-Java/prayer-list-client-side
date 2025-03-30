import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';
import { DaveningService } from 'src/app/shared/services/davening.service';

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
    settingsForm: UntypedFormGroup = new UntypedFormGroup({});
    prompt: boolean = false;
    wait: number = 0;
    settingsUpdatedSub: Subscription = new Subscription;
    disableSubmit: boolean = false;

    constructor(public daveningService: DaveningService, public adminService: AdminService, public router: Router, public authService: AuthService) { }

    async ngOnInit() {
        this.adminService.populateAdminSettings();
        this.populateSettingsForm();

        this.settingsUpdatedSub = this.adminService.settingsUpdated.subscribe(adminSettings => {
            this.prompt = adminSettings.newNamePrompt ?? this.prompt;
            this.wait = adminSettings.waitBeforeDeletion ?? this.wait;
        });
    }

    populateSettingsForm() {
        this.settingsForm = new UntypedFormGroup({
            'prompt': new UntypedFormControl(this.adminService.adminSettings.newNamePrompt),
            'wait': new UntypedFormControl(this.adminService.adminSettings.waitBeforeDeletion, [Validators.required, Validators.pattern(/^\d+$/)]) //prevent negative or decimals. also null value (empty) is still considered a value (valid for 'required')
        });
    }

    onSubmit() {
        if (this.wait < 0 || this.wait == null) {
            this.disableSubmit = true;
            return;
        }
        else {
            this.adminService.editSettings(this.adminService.adminSettings.email ?? '', this.prompt, this.wait);
        }
    }

    onCancel() {
        this.router.navigate(['admin/names']);
    }

    checkWaitInput() {
        this.disableSubmit = (this.wait < 0 || this.wait == null);
    }

    ngOnDestroy() {
        if (this.settingsUpdatedSub)
            this.settingsUpdatedSub.unsubscribe();
    }
}