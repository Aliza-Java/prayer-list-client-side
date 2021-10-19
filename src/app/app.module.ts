import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { GuestHomeComponent } from './guest/guest-home/guest-home.component';
import { FooterComponent } from './footer/footer.component';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { GuestSubmitNameComponent } from './guest/guest-submit-name/guest-submit-name.component';
import { GuestEditNameComponent } from './guest/guest-edit-name/guest-edit-name.component';
import { AdminSubmitNameComponent } from './admin/admin-submit-name/admin-submit-name.component';
import { AdminEditNameComponent } from './admin/admin-edit-name/admin-edit-name.component';
import { ManageEmailsComponent } from './admin/manage-emails/manage-emails.component';
import { GuestNamesComponent } from './guest/guest-names/guest-names.component';
import { WeeklyComponent } from './admin/weekly/weekly.component';
import { UrgentComponent } from './admin/urgent/urgent.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GuestEmailComponent } from './guest/guest-email/guest-email.component';
import { FilterActivePipe } from './shared/filters/filter-active.pipe';
import { EmptyListComponent } from './empty-list/empty-list.component';
import { DaveningService } from './shared/services/davening.service';
import { HttpService } from './shared/services/http.service';
import { AdminService } from './admin/admin.service';
import { SelectDavenforsComponent } from './select-davenfors/select-davenfors.component';
import { AdminNamesComponent } from './admin/admin-names/admin-names.component';
import { GuestService } from './guest/guest.service';
import { DropdownDirective } from './shared/dropdown.directive';
import { GuestSettingsComponent } from './guest/guest-settings/guest-settings.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdminHomeComponent,
    GuestHomeComponent,
    FooterComponent,
    SuccessComponent,
    ErrorComponent,
    AdminLoginComponent,
    GuestSubmitNameComponent,
    GuestEditNameComponent,
    AdminSubmitNameComponent,
    AdminEditNameComponent,
    ManageEmailsComponent,
    GuestNamesComponent,
    WeeklyComponent,
    UrgentComponent,
    AdminSettingsComponent,
    GuestSettingsComponent,
    NotFoundComponent,
    GuestEmailComponent,
    FilterActivePipe,
    EmptyListComponent,
    SelectDavenforsComponent,
    AdminNamesComponent,
    DropdownDirective,
    GuestSettingsComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
],
  providers: [DaveningService, HttpService, AdminService, GuestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
