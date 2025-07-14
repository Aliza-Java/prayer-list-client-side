import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { GuestService } from '../../guest.service';

@Component({
    selector: 'app-guest-edit-name',
    templateUrl: './guest-edit-name.component.html',
    styleUrls: ['./guest-edit-name.component.css']
})
export class GuestEditNameComponent implements OnInit {
    dfToEdit: Davenfor = new Davenfor;

    constructor(public daveningService: DaveningService, public httpService: HttpService, public guestService: GuestService, public router: Router) { }

    async ngOnInit() {
        this.dfToEdit = this.guestService.davenforToEdit ?? new Davenfor;
    }

    onSave(editedDavenfor: any) {
        this.daveningService.loading.set(true);
        this.guestService.editDavenfor(editedDavenfor);
    }

    onCancel() {
        this.guestService.davenforToEdit = new Davenfor;
        this.router.navigate(['guest/names']);
    }
}