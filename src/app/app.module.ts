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
import { AdminComponent } from './admin/admin.component';
import { GuestComponent } from './guest/guest.component';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { SubmitNameComponent } from './submit-name/submit-name.component';
import { ManageEmailsComponent } from './admin/manage-emails/manage-emails.component';
import { ManageNamesComponent } from './manage-names/manage-names.component';
import { WeeklyComponent } from './admin/weekly/weekly.component';
import { UrgentComponent } from './admin/urgent/urgent.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GuestEmailComponent } from './guest/guest-home/guest-email/guest-email.component';
import { FilterActivePipe } from './shared/filters/filter-active.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdminHomeComponent,
    GuestHomeComponent,
    FooterComponent,
    AdminComponent,
    GuestComponent,
    SuccessComponent,
    ErrorComponent,
    AdminLoginComponent,
    SubmitNameComponent,
    ManageEmailsComponent,
    ManageNamesComponent,
    WeeklyComponent,
    UrgentComponent,
    SettingsComponent,
    NotFoundComponent,
    GuestEmailComponent,
    FilterActivePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
