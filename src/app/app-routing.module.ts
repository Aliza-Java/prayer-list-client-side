import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestHomeComponent } from './guest/guest-home/guest-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { GuestSubmitNameComponent } from './guest/guest-submit-name/guest-submit-name.component';
import { GuestNamesComponent as GuestNamesComponent } from './guest/guest-names/guest-names.component';
import { ManageEmailsComponent } from './admin/manage-emails/manage-emails.component';
import { WeeklyComponent } from './admin/weekly/weekly.component';
import { UrgentComponent } from './admin/urgent/urgent.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminNamesComponent } from './admin/admin-names/admin-names.component';
import { AdminSubmitNameComponent } from './admin/admin-submit-name/admin-submit-name.component';
import { AdminEditNameComponent } from './admin/admin-edit-name/admin-edit-name.component';
import { GuestSettingsComponent } from './guest/guest-settings/guest-settings.component';
import { GuestEditNameComponent } from './guest/guest-edit-name/guest-edit-name.component';


const routes: Routes = [
    { path: '', redirectTo: 'guest', pathMatch: 'full' },
    {
        path: 'guest', component: GuestHomeComponent, children: [
            { path: 'new', component: GuestSubmitNameComponent },
            { path: 'edit', component: GuestEditNameComponent},
            { path: 'names', component: GuestNamesComponent },
            { path: 'settings', component: GuestSettingsComponent }
        ]
    },
    {
        path: 'admin', component: AdminHomeComponent, children: [
            { path: '', component: AdminNamesComponent, pathMatch: 'full' },
            { path: 'submit', component: AdminSubmitNameComponent },
            { path: 'edit', component: AdminEditNameComponent},
            { path: 'names', component: AdminNamesComponent },
            { path: 'emails', component: ManageEmailsComponent },
            { path: 'weekly', component: WeeklyComponent },
            { path: 'urgent', component: UrgentComponent },
            { path: 'settings', component: AdminSettingsComponent }
        ]
    },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
