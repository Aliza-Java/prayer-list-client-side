import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Davenfor } from '../../../shared/models/davenfor.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';

@Component({
    selector: 'app-admin-names',
    templateUrl: './admin-names.component.html',
    styleUrls: ['./admin-names.component.css']
})
export class AdminNamesComponent implements OnInit {

    categories: string[] = [];
    davenfors: Davenfor[] = [];
    davenforsChangedSub: Subscription = new Subscription;
    finishedLoading:boolean = false;

    constructor(public router: Router, public adminService: AdminService, public daveningService:DaveningService) { }
    
    ngOnInit() {
        this.finishedLoading = false;
        this.davenforsChangedSub = this.adminService.davenforsChanged.subscribe(davenfors => { 
            this.davenfors = davenfors; 
            });

        this.adminService.populateAdminDavenfors().then((response)=> {
            this.davenfors = response;
            this.finishedLoading = true;
        });
    }

    onEdit(davenfor: Davenfor) {
        this.adminService.davenforToEdit = davenfor;
        this.router.navigate(['admin/edit']);
    }

    onDelete(davenfor : Davenfor) {
        let name = (davenfor.nameEnglish?.trim().length == 0 ? davenfor.nameHebrew : davenfor.nameEnglish) ?? '';

        if (confirm(`Are you sure you want to delete the name '${name}' ?`))
            this.adminService.deleteDavenfor(davenfor.id??0, name);
    }

    onAddName() {
        this.router.navigate(['admin/submit']);
    }

    onRefresh() {
        this.adminService.populateAdminDavenfors();
    }

    ngOnDestroy() {
        if (this.davenforsChangedSub)
            this.davenforsChangedSub.unsubscribe();
    }
}