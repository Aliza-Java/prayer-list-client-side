import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { GuestService } from 'src/app/guest/guest.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-guest-home',
    templateUrl: './guest-home.component.html',
    styleUrls: ['./guest-home.component.css']
})
export class GuestHomeComponent implements OnInit, OnDestroy {
    changeEmailAllowed = true;
    guestEmailForm: FormGroup;
    addDavenforSub: Subscription;
    davenforsChangedSub: Subscription;

    constructor(
        public router: Router, public daveningService: DaveningService, public httpService: HttpService, public guestService: GuestService) {
    }

    ngOnInit() {
        this.router.navigate['names'];

        this.addDavenforSub = this.guestService.davenforAdded.subscribe((addedAlready: boolean) => {
            if (addedAlready) {
                this.router.navigate['names'];
            }
        });

        this.davenforsChangedSub = this.guestService.myDavenforsChanged.subscribe((names) => {
            if (names.length > 0) {
                this.guestService.loadedDavenfors = true;
            }
            else {
                this.guestService.loadedDavenfors = false;
            }
        });
    }


    ngOnDestroy() {
        this.addDavenforSub.unsubscribe();
        this.davenforsChangedSub.unsubscribe();
    }

}
