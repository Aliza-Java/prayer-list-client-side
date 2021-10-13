import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Category } from 'src/app/shared/models/category.model';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { GuestService } from 'src/app/guest/guest.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-guest-names',
    templateUrl: './guest-names.component.html',
    styleUrls: ['./guest-names.component.css']
})
export class GuestNamesComponent implements OnInit, OnDestroy {

    categories: Category[];
    davenfors: Davenfor[];
    davenforsChangedSub: Subscription;

    constructor(public router: Router, public guestService: GuestService, public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService) { }
    ngOnInit() {
        this.daveningService.clearMessages();
        this.davenfors = this.guestService.returnDavenfors();
        this.davenforsChangedSub = this.guestService.myDavenforsChanged.subscribe(davenfors => { this.davenfors = davenfors });
    }

    onEdit(davenfor: Davenfor) {
        this.guestService.davenforToEdit = davenfor;
        this.router.navigate(['guest/edit']);
    }

    onAddName() {
        this.router.navigate(['guest/new']);
    }

    onDelete(id: number, name: string) {
        if (confirm(`Are you sure you want to delete the name ${name} ?`))
            this.guestService.deleteDavenfor(id, name);
    }

    ngOnDestroy() {
        if (this.davenforsChangedSub) //Sometimes undefined, perhaps when forcibly reroute.
            this.davenforsChangedSub.unsubscribe();
    }
}