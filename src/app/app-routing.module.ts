import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestHomeComponent } from './guest/guest-home/guest-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { SubmitNameComponent } from './submit-name/submit-name.component';
import { ManageNamesComponent } from './manage-names/manage-names.component';
import { ManageEmailsComponent } from './admin/manage-emails/manage-emails.component';
import { WeeklyComponent } from './admin/weekly/weekly.component';
import { UrgentComponent } from './admin/urgent/urgent.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
    {path: '', redirectTo: 'guest', pathMatch: 'full'}, 
    {path: 'guest', component: GuestHomeComponent, children: [
        {path: 'new', component: SubmitNameComponent},
        {path: 'names', component: ManageNamesComponent}
    ]},
    {path: 'admin', component: AdminHomeComponent, children: [
        {path: '', component: ManageNamesComponent, pathMatch: 'full'},
        {path: 'submit', component: SubmitNameComponent},
        {path: 'names', component: ManageNamesComponent},
        {path: 'emails', component: ManageEmailsComponent},
        {path: 'weekly', component: WeeklyComponent},
        {path: 'urgent', component: UrgentComponent},
        {path: 'settings', component: SettingsComponent}
    ]},
    {path: '**', component: NotFoundComponent} //TODO: design this
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
