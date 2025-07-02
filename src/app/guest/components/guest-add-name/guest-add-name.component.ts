import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DaveningService } from '../../../shared/services/davening.service';
import { GuestService } from '../../guest.service';

@Component({
    selector: 'app-guest-add-name',
    templateUrl: './guest-add-name.component.html',
    styleUrls: ['./guest-add-name.component.css']
})
export class GuestAddNameComponent {

    constructor(
        public router: Router,
        public guestService: GuestService,
        public daveningService: DaveningService) { }

    onSave(newDavenfor: any) {
        newDavenfor.userEmail = this.guestService.guestEmail();
        console.log(newDavenfor);
        this.guestService.addDavenfor(newDavenfor);
    }

    onCancel() {
        this.router.navigate(['guest/names']);
    }
}