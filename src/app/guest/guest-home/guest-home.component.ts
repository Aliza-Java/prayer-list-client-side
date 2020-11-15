import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-guest-home',
    templateUrl: './guest-home.component.html',
    styleUrls: ['./guest-home.component.css']
})
export class GuestHomeComponent implements OnInit, OnDestroy {
    addNameMode = false;
    changeEmailAllowed = true;
    guestEmailForm: FormGroup;
    addDavenforSub: Subscription;
    davenforsChangedSub: Subscription;
    loadedDavenfors = false;

    constructor(
        public daveningService: DaveningService, public httpService: HttpService) {
    }

    ngOnInit() {
        this.addDavenforSub = this.httpService.davenforAdded.subscribe((addedAlready: boolean) => {
            if (addedAlready) {
                this.addNameMode = false; //revert back to name list
            }
        });

        this.davenforsChangedSub = this.daveningService.davenforsChanged.subscribe((names)=>{
            if(names.length>0){
                this.loadedDavenfors = true;
            }
            else{
                this.loadedDavenfors = false;
            }
        });
    }

    onClickNew() {
        this.addNameMode = true;
    }

    ngOnDestroy() {
        this.addDavenforSub.unsubscribe();
        this.davenforsChangedSub.unsubscribe();
    }


}
