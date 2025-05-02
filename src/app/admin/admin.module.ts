import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminNamesComponent } from './components/admin-names/admin-names.component';
import { AdminSubmitNameComponent } from './components/admin-submit-name/admin-submit-name.component';
import { AdminEditNameComponent } from './components/admin-edit-name/admin-edit-name.component';
import { ManageEmailsComponent } from './components/manage-emails/manage-emails.component';
import { WeeklyComponent } from './components/weekly/weekly.component';
import { UrgentComponent } from './components/urgent/urgent.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';
import { DirectPreviewComponent } from './components/direct/direct-preview.component';

@NgModule({
    declarations: [
        AdminLoginComponent,
        AdminHomeComponent,
        AdminSubmitNameComponent,
        AdminEditNameComponent,
        ManageEmailsComponent,
        WeeklyComponent,
        UrgentComponent,
        AdminSettingsComponent,
        AdminNamesComponent,
        DirectPreviewComponent 
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule,
        AdminRoutingModule
    ],
    providers: [AdminService]
})
export class AdminModule { }