import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { FilterActivePipe } from './filters/filter-active.pipe';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { SelectDavenforsComponent } from '../select-davenfors/select-davenfors.component';
import { DropdownDirective } from './dropdown.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ViewCategoryPipe } from './filters/view-category.pipe';
import { EditNameComponent } from '../edit-name/edit-name.component';
import { AddNameComponent } from '../add-name/add-name.component';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        NotFoundComponent,
        FilterActivePipe,
        EmptyListComponent,
        SelectDavenforsComponent,
        DropdownDirective, 
        ViewCategoryPipe,
        EditNameComponent,
        AddNameComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule
    ],
    exports: [
        EmptyListComponent,
        EditNameComponent,
        AddNameComponent,
        FormsModule,
        NotFoundComponent,
        LoadingSpinnerComponent,
        SelectDavenforsComponent,
        DropdownDirective, 
        ViewCategoryPipe, 
        FilterActivePipe]
})
export class SharedModule { }