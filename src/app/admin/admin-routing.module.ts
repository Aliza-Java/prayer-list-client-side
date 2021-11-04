import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminEditNameComponent } from './components/admin-edit-name/admin-edit-name.component';
import { AdminNamesComponent } from './components/admin-names/admin-names.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { AdminSubmitNameComponent } from './components/admin-submit-name/admin-submit-name.component';
import { ManageEmailsComponent } from './components/manage-emails/manage-emails.component';
import { UrgentComponent } from './components/urgent/urgent.component';
import { WeeklyComponent } from './components/weekly/weekly.component';


const routes: Routes = [
       {
        path: '', component: AdminHomeComponent, children: [
            { path: '', component: AdminNamesComponent, pathMatch: 'full' },
            { path: 'submit', component: AdminSubmitNameComponent },
            { path: 'edit', component: AdminEditNameComponent},
            { path: 'names', component: AdminNamesComponent },
            { path: 'emails', component: ManageEmailsComponent },
            { path: 'weekly', component: WeeklyComponent },
            { path: 'urgent', component: UrgentComponent },
            { path: 'settings', component: AdminSettingsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }