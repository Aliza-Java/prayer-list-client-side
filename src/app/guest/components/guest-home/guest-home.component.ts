import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
    guestEmailForm: UntypedFormGroup = new UntypedFormGroup({});
    addDavenforSub: Subscription = new Subscription;
    davenforsChangedSub: Subscription = new Subscription;

    constructor(
        public router: Router,
        public daveningService: DaveningService,
        public httpService: HttpService,
        public guestService: GuestService) {
    }

    ngOnInit() {
       

        // this.addDavenforSub = this.guestService.davenforAdded.subscribe((addedAlready: Boolean) => {
        //     if (addedAlready) {
        //         this.router.navigate(['hello']);
        // //     }
        // });

        this.davenforsChangedSub = this.guestService.myDavenforsChanged.subscribe((names) => {
            this.guestService.loadedDavenfors = (names.length > 0) ? true : false;
        });
    }

    changeOfRoutes() {
        this.daveningService.clearMessages();
    }

    ngOnDestroy() {
        this.addDavenforSub.unsubscribe();
        this.davenforsChangedSub.unsubscribe();
    }
}