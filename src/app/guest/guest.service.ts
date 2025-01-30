import { Injectable } from '@angular/core';
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

    myDavenfors: Davenfor[] = [];
    guestEmail: string = '';
    myDavenforsChanged = new Subject<Davenfor[]>();
    davenforAdded = new Subject<Boolean>();
    loadedDavenfors = false;
    davenforToEdit: Davenfor = new Davenfor;
    loading = false;
    categories: string[] = [];

    constructor(public router: Router,
        public httpService: HttpService,
        public daveningService: DaveningService) {
        this.populateCategories();
    }

    getCategory(name: string) {
        //double equal sign (instead of triple) since incoming id is a string while category.id is a number.
        return this.categories.find(category => category == name);
    }

    populateCategories() {

        console.log("reached guest.servce");
        this.httpService.getCategories().subscribe({
            next: categories => { console.log(categories); },
            error: error => { console.log(error);
                console.log("this error is in guest.service.ts" ); },
            complete: () => { console.log('Categories fetched successfully'); }
        });
    }

    populateGuestDavenfors() {
        this.loading = true;
        this.httpService.getDavenfors('sub/getmynames/' + this.guestEmail).subscribe(
            names => {
                this.myDavenfors = names;
                this.myDavenforsChanged.next(names);
                //buzz the event, so every subscribing component reacts accordingly.
                this.loading = false;
            },
            error => {
                this.daveningService.errorMessage = `We could not retrieve names associated with ${this.guestEmail}`;
                this.loading = false;
            });
    }

    public deleteDavenfor(davenforId: number, englishName: string) {
        this.loading = true;
        this.httpService.deleteDavenfor(`sub/delete/${davenforId}/${this.guestEmail}`).subscribe(
            updatedList => {
                this.myDavenfors = updatedList;
                this.myDavenforsChanged.next(updatedList);
                this.daveningService.successMessage = `The name '${englishName}' has been deleted`;
                this.loading = false;
            },
            error => {
                this.daveningService.errorMessage = `There was a problem deleting the name "${englishName}"`;
                console.log(error);
                this.loading = false;
            }
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
            "", //expireAt: server will set the right one
            today, //createdAt
            today); //updatedAt

        this.loading = true;

        if (basicInfo.submitterEmail != undefined && newDavenfor != undefined) {
            this.httpService.addDavenfor(basicInfo.submitterEmail, newDavenfor).subscribe(
                () => {
                    this.populateGuestDavenfors();
                    this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                    this.loading = false;
                    this.router.navigate(['guest/names']);    //Guest probably wants to add just one name, returning to list             
                },
                error => {
                    this.daveningService.errorMessage = `We are sorry.  There was an error adding the name "${basicInfo.nameEnglish}"`;
                    console.log(error);
                    this.loading = false;
                }
            );
        }
        else {
            console.log('Email given is ' + basicInfo.submitterEmail + ' and new davenfor is ' + newDavenfor);
        }
    }

    public editDavenfor(davenfor: Davenfor) {
        davenfor.submitterEmail = this.guestEmail;
        this.loading = true;
        this.httpService.editDavenfor('sub/updatename/' + this.guestEmail, davenfor).subscribe(
            response => {
                this.populateGuestDavenfors();
                this.loading = false;
                this.router.navigate(['guest/names']);
            },
            error => {
                this.daveningService.errorMessage = "We are sorry. There was an error when saving the new edits.";
                this.loading = false;
            }
        );
    }
}