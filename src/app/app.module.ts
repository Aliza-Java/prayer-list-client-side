import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';

import { HttpService } from './shared/services/http.service';
import { DaveningService } from './shared/services/davening.service';

import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { GuestRoutingModule } from './guest/guest-routing.module';
import { AdminRoutingModule } from './admin/admin-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SuccessComponent,
        ErrorComponent        
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        SharedModule,
        AdminRoutingModule, 
        GuestRoutingModule
    ],
    providers: [DaveningService, HttpService],
    bootstrap: [AppComponent]
})
export class AppModule { }
