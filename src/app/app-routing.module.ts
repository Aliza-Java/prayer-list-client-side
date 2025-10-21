import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { DirectPreviewComponent } from './admin/components/direct/direct-preview.component';
import { DirectSendComponent } from './admin/components/direct-send/direct-send.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { ConfirmListComponent } from './guest/components/confirm-list/confirm-list.component';

const routes: Routes = [
    { path: '', redirectTo: 'guest', pathMatch: 'full' },
    { path: 'guest', loadChildren: () => import('./guest/guest.module').then(m => m.GuestModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'delete', loadComponent: () => import('./delete-confirm/delete-confirm.component').then(m => m.DeleteConfirmComponent) },
    { path: 'down', loadComponent: () => import('./down/down.component').then(m => m.DownComponent) },
    { path: 'extend', loadComponent: () => import('./extend/extend.component').then(m => m.ExtendComponent) },
    { path: 'unsubscribe', component: UnsubscribeComponent },
    { path: 'direct-preview', component: DirectPreviewComponent },
    { path: 'direct-send', component: DirectSendComponent },
    { path: 'confirm/:category/:token', component: ConfirmListComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules /*, relativeLinkResolution: 'legacy' */ })],
    exports: [RouterModule]
})
export class AppRoutingModule { }