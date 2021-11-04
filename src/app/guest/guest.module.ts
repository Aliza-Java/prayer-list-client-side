import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestNamesComponent } from './components/guest-names/guest-names.component';
import { GuestHomeComponent } from './components/guest-home/guest-home.component';
import { GuestSubmitNameComponent } from './components/guest-submit-name/guest-submit-name.component';
import { GuestEditNameComponent } from './components/guest-edit-name/guest-edit-name.component';
import { GuestEmailComponent } from './components/guest-email/guest-email.component';
import { GuestSettingsComponent } from './components/guest-settings/guest-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GuestRoutingModule } from './guest-routing.module';
import { GuestService } from './guest.service';

@NgModule({
  declarations: [
    GuestHomeComponent,
    GuestSubmitNameComponent,
    GuestNamesComponent,
    GuestEditNameComponent,
    GuestSettingsComponent,
    GuestEmailComponent,
    GuestSettingsComponent
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    SharedModule,
    RouterModule,
    GuestRoutingModule
  ],
  providers: [GuestService]
})
export class GuestModule { }