import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { GuestService } from 'src/app/guest/guest.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-guest-email',
    templateUrl: './guest-email.component.html',
    styleUrls: ['./guest-email.component.css']
})
export class GuestEmailComponent implements OnInit {
    addNameMode = false;
    changeEmailAllowed = true;
    guestEmailForm: UntypedFormGroup;
    constructor(
        public router:Router, public guestService: GuestService, public daveningService: DaveningService, public httpService: HttpService) { }

    ngOnInit() {
        this.guestEmailForm = new UntypedFormGroup({
            'emailInput': new UntypedFormControl(null, [Validators.required, Validators.email])
        });
    }

    onChangeEmail() {
        this.changeEmailAllowed = true;
    }

    onSaveEmail(newEmail: string) {
        this.changeEmailAllowed = false;
        this.guestService.guestEmail = newEmail;
        this.guestService.populateGuestDavenfors();
        this.router.navigate(['guest/names']);
    } 
}
