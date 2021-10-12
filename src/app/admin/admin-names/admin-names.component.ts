import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { Davenfor } from '../../shared/models/davenfor.model';
import { AdminService } from '../admin.service';
import { HttpService } from '../../shared/services/http.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-names',
    templateUrl: './admin-names.component.html',
    styleUrls: ['./admin-names.component.css']
})
export class AdminNamesComponent implements OnInit {

    categories: Category[];
    davenfors: Davenfor[];
    davenforsChangedSub: Subscription;

    constructor(public router: Router, public httpService: HttpService, public adminService: AdminService) { }
    ngOnInit() {
        this.davenfors = this.adminService.returnDavenfors();
        this.davenforsChangedSub = this.adminService.davenforsChanged.subscribe(davenfors => { this.davenfors = davenfors });
    }

    onEdit(davenfor: Davenfor) {
        this.adminService.davenforToEdit = davenfor;
        this.router.navigate(['admin/edit']);
    }

    onDelete(id: number, name: string) {
        if (confirm(`Are you sure you want to delete the name ${name} ?`))
            this.adminService.deleteDavenfor(id, name);
    }

    onAddName() {
        this.router.navigate(['admin/submit']);
    }

    onRefresh() {
        this.adminService.populateAdminDavenfors();
    }

    ngOnDestroy() {
        this.davenforsChangedSub.unsubscribe();
    }
}