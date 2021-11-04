import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerSmallComponent } from './loading-spinner-small/loading-spinner-small.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { FilterActivePipe } from './filters/filter-active.pipe';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { SelectDavenforsComponent } from '../select-davenfors/select-davenfors.component';
import { DropdownDirective } from './dropdown.directive';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        LoadingSpinnerSmallComponent,
        NotFoundComponent,
        FilterActivePipe,
        EmptyListComponent,
        SelectDavenforsComponent,
        DropdownDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    exports: [
        EmptyListComponent,
        NotFoundComponent,
        LoadingSpinnerComponent,
        LoadingSpinnerSmallComponent,
        FilterActivePipe,
        SelectDavenforsComponent,
        DropdownDirective]
})
export class SharedModule { }