import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { TokenInterceptor } from './admin/auth/token.interceptor';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { ExtendComponent } from './extend/extend.component';
import { DownComponent } from './down/down.component';
import { HttpConfigInterceptor } from './shared/interceptors/httpconfig.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SuccessComponent,
        ErrorComponent,
    ],
    imports: [
        UnsubscribeComponent,
        DeleteConfirmComponent,
        ExtendComponent,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        SharedModule,
        AdminRoutingModule,
        GuestRoutingModule, 
        DownComponent
    ],
    providers: [
        DaveningService, 
        HttpService, 
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: TokenInterceptor, 
            multi: true 
        },
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: HttpConfigInterceptor, 
            multi: true 
        }

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }