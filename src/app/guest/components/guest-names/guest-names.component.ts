import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { Subscription } from 'rxjs';
import { GuestService } from 'src/app/guest/guest.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-guest-names',
    templateUrl: './guest-names.component.html',
    styleUrls: ['./guest-names.component.css']
})
export class GuestNamesComponent implements OnInit, OnDestroy {

    categories: string[] = [];
    davenfors: Davenfor[] = [];
    davenforsChangedSub: Subscription = new Subscription;

    constructor(
        public router: Router,
        public guestService: GuestService,
        public daveningService: DaveningService,
        public httpService: HttpService, 
        private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.davenfors = this.guestService.myDavenfors;
        this.davenforsChangedSub = this.guestService.myDavenforsChanged.subscribe(
            davenfors => { this.davenfors = davenfors });
    }

    davenforsExist(){
            return (this.davenfors != null && this.davenfors.length > 0); 
    }

    onEdit(davenfor: Davenfor) {
        this.guestService.davenforToEdit = davenfor;
        this.router.navigate(['guest/edit']);
    }

    onAddName() {
        this.router.navigate(['guest/new']);
    }

    onDelete(index: number, id: number, name: string) {
        if (confirm(`Are you sure you want to delete the name ${name} ?`))
        {
            this.guestService.activeRow = index;
            this.guestService.loading = true;
            this.cdRef.detectChanges(); // Force change detection to update spinner

            this.guestService.deleteDavenfor(id, name);
        }
    }

    ngOnDestroy() {
        if (this.davenforsChangedSub) //Sometimes undefined, perhaps when forcibly reroute.
            this.davenforsChangedSub.unsubscribe();
    }
}