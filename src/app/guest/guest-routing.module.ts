import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestEditNameComponent } from './components/guest-edit-name/guest-edit-name.component';
import { GuestHomeComponent } from './components/guest-home/guest-home.component';
import { GuestNamesComponent } from './components/guest-names/guest-names.component';
import { GuestSettingsComponent } from './components/guest-settings/guest-settings.component';
import { GuestAddNameComponent } from './components/guest-add-name/guest-add-name.component';

const routes: Routes = [
    {
        path: '',
        component: GuestHomeComponent, 
        children: [
            { path: 'new', component: GuestAddNameComponent },
            { path: 'edit', component: GuestEditNameComponent },
            { path: 'names', component: GuestNamesComponent },
            { path: 'settings', component: GuestSettingsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GuestRoutingModule { }