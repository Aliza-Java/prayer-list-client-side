import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: '', redirectTo: 'guest', pathMatch: 'full' },
    { path: 'guest', loadChildren: () => import('./guest/guest.module').then(m => m.GuestModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'unsubscribe', loadComponent: () => import('./unsubscribe/unsubscribe.component').then(m => m.UnsubscribeComponent)},
    { path: 'delete', loadComponent: () => import('./delete-confirm/delete-confirm.component').then(m => m.DeleteConfirmComponent)},
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules /*, relativeLinkResolution: 'legacy' */})],
    exports: [RouterModule]
})
export class AppRoutingModule { }