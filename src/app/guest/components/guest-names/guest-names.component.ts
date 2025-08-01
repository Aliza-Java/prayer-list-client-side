import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { GuestService } from 'src/app/guest/guest.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-guest-names',
    templateUrl: './guest-names.component.html',
    styleUrls: ['./guest-names.component.css']
})
export class GuestNamesComponent implements OnInit {
    ngOnInit() {
        this.guestService.populateGuestDavenfors();
    }

    categories: string[] = [];

    constructor(
        public router: Router,
        public guestService: GuestService,
        public daveningService: DaveningService,
        public httpService: HttpService) { }

    davenforsExist(){
            return (this.guestService.myDavenfors() != null && this.guestService.myDavenfors().length > 0); 
    }

    onEdit(davenfor: Davenfor) {
        this.guestService.davenforToEdit = davenfor;
        this.router.navigate(['guest/edit']);
    }

    onAddName() {
        this.router.navigate(['guest/new']);
    }

    onDelete(index: number, davenfor: Davenfor) { 
        let name = (davenfor.nameEnglish?.trim().length == 0 ? davenfor.nameHebrew : davenfor.nameEnglish) ?? '';   
        let id = davenfor.id ?? 0;
        if (confirm(`Are you sure you want to delete the name '${name}' ?`))
        {
            this.guestService.activeRow = index;
            this.guestService.deleteDavenfor(id, name);
        }
    }
}