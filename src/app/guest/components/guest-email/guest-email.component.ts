import { Component, OnInit, computed } from '@angular/core';
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
    
    emailInHeader = computed(() => {
        const optionalEmail = this.guestService.optionalGuest();
        return optionalEmail === '' ? this.guestService.guestEmail() : optionalEmail;
    });
    emailInEditing = true;
    guestEmailForm: UntypedFormGroup = new UntypedFormGroup({});
    constructor(
        public router: Router, public guestService: GuestService, public daveningService: DaveningService, public httpService: HttpService) { }

    ngOnInit() {
        this.guestEmailForm = new UntypedFormGroup({
            'emailInput': new UntypedFormControl(this.guestService.guestEmail(), [Validators.required, Validators.email])
        });
    }

    onChangeEmail() {
        this.emailInEditing = true;
    }

    onSaveEmail(newEmail: string) {
        if (newEmail == this.emailInHeader()) { //nothing changed
            this.emailInEditing = false;
            this.guestService.populateGuestDavenfors();
            this.router.navigate(['guest/names']);
        }

        //either email is empty (no confirmation needed) or switching - need to confirm
        if (this.emailInHeader() == '' || (this.emailInHeader() != newEmail && confirm('Are you sure you want to log in with a different email?'))) {
            this.guestService.optionalGuest.set(newEmail);
            this.guestService.sendOtpToGuest(newEmail); //check in service
        }
        this.emailInEditing = false;
    }
}
