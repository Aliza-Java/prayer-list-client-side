import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../shared/services/http.service';
import { Category } from '../shared/models/category.model';
import { Davenfor } from '../shared/models/davenfor.model';
import { DaveningService } from '../shared/services/davening.service';
import { Subscription } from 'rxjs';
import { AdminService } from '../shared/services/admin.service';

@Component({
    selector: 'app-manage-names',
    templateUrl: './manage-names.component.html',
    styleUrls: ['./manage-names.component.css']
})
export class ManageNamesComponent implements OnInit, OnDestroy {

    categories: Category[];
    davenfors: Davenfor[];
    davenforsChangedSub: Subscription;

    constructor(public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService) { }
    //TODO: make empty-list component showing if nothing.
    ngOnInit() {
        this.httpService.getDavenfors();
        this.davenforsChangedSub = this.daveningService.davenforsChanged.subscribe(davenfors => { this.davenfors = davenfors });
    }

    onEdit(davenfor: Davenfor) {
        this.httpService.editDavenfor(davenfor);
        //show updated list - subject
    }

    onDelete(name: string, id: number) {
        if (confirm(`Are you sure you want to delete the name ${name} ?`))
            this.httpService.deleteDavenfor(id);
    }

    ngOnDestroy() {
        this.davenforsChangedSub.unsubscribe();
    }

}
