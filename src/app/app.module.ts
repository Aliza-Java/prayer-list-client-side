import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpService } from './shared/services/http.service';

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
import { AuthInterceptorService } from './admin/auth/auth-interceptor.service';
import { OneTimePasswordComponent } from './guest/components/one-time-password/one-time-password.component';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        OneTimePasswordComponent],
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
        DownComponent, 
        SuccessComponent, 
        ErrorComponent
    ],
    providers: [
        HttpService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
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