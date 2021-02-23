import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Davenfor } from '../shared/models/davenfor.model';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class GuestService { //A service focusing on guest data and tasks (vs. admin)

    myDavenfors: Davenfor[];
    guestEmail: string;
    myDavenforsChanged = new Subject<Davenfor[]>();
    davenforAdded = new Subject<Boolean>();
    loadedDavenfors = false;


    constructor(public router: Router, public httpService: HttpService, public daveningService: DaveningService) {

    }

    populateGuestDavenfors() {
        this.httpService.getDavenfors('getmynames/' + this.guestEmail).subscribe(
            names => {
                this.myDavenfors = names;
                this.myDavenforsChanged.next(names);
                //buzz the event, so every subscribing component reacts accordingly.
            },
            error => {
                if (error.status == '404') {
                    this.myDavenforsChanged.next([]);
                }
            });
    }

    public returnDavenfors() {
        return this.myDavenfors.slice();
    }

    public deleteDavenfor(davenforId: number, englishName: string) {
        this.httpService.deleteDavenfor(`delete/${davenforId}/${this.guestEmail}`).subscribe(
            updatedList => {
                this.myDavenfors = updatedList;
                this.myDavenforsChanged.next(updatedList);
                this.daveningService.successMessage = `The name '${englishName}' has been deleted`;


            },//refreshing list reflects deleted item.
            error => { console.log(error) }
        );
    }

    addDavenfor(basicInfo: SimpleDavenfor) {
        const today = new Date().toISOString().split('T')[0]; //used multiple times in the new Davenfor.
        const newDavenfor = new Davenfor(
            -1,
            basicInfo.submitterEmail, //need to fix this!
            basicInfo.category,
            basicInfo.nameHebrew,
            basicInfo.nameEnglish,
            basicInfo.nameHebrewSpouse,
            basicInfo.nameEnglishSpouse,
            basicInfo.submitterToReceive,
            today, //lastConfirmedAt
            null, //expireAt: server will set the right one
            today, //createdAt
            today); //updatedAt

        this.httpService.addDavenfor(basicInfo.submitterEmail, newDavenfor).subscribe(
            () => {
                this.populateGuestDavenfors();
                this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                //The line below does not get executed due to 'ExpressionChangedAfterItHasBeenCheckedError'.  Leaving it for now. 
                //this.daveningService.successMessage = `The name '${basicInfo.nameEnglish}' has been added to the '${basicInfo.category.english}' list`;
                this.router.navigate(['guest/guestnames']);    //Guest probably wants to add just one name, returning to list             
            },
            error => { console.log(error) }
        );
    }

    public editDavenfor(davenfor: Davenfor) {
        this.httpService.editDavenfor('updatename/' + this.guestEmail, davenfor).subscribe(
            response => { console.log(response) },
            error => { console.log(error) }
        );
    }

}
