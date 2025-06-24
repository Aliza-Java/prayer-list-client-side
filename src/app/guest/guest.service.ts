import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject } from 'rxjs';
import { Davenfor } from '../shared/models/davenfor.model';
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
    activeRow: number | null = null;

    constructor(public router: Router,
        public httpService: HttpService,
        public daveningService: DaveningService) {
    }


    getCategory(name: string) {
        //double equal sign (instead of triple) since incoming id is a string while category.id is a number.
        return this.daveningService.categories.find(category => category == name);
    }

    populateGuestDavenfors(guestEmail: string) {
        this.daveningService.setLoading(true);
        this.httpService.getDavenfors('user/getmynames/' + guestEmail).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                names => {
                    this.daveningService.serverFine = true;
                    this.myDavenfors = names;
                    this.guestEmail = guestEmail; //save the email in the service, so it can be used later
                    //buzz the event, so every subscribing component reacts accordingly.
                    this.myDavenforsChanged.next(names);
                },
                (error) => {
                    if (error.status === 404) //only registered users can enter
                        this.daveningService.setErrorMessage(`Unknown user ${guestEmail}.  Please check your email or register with the system admin`);
                    else
                        this.daveningService.setErrorMessage(`We could not retrieve names associated with ${this.guestEmail}`);
                });
    }

    public deleteDavenfor(davenforId: number, englishName: string) {
        this.daveningService.setLoading(true);
        this.httpService.deleteDavenfor(`user/delete/${davenforId}/${this.guestEmail}`).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                updatedList => {
                    this.myDavenfors = updatedList;
                    this.myDavenforsChanged.next(updatedList);
                    this.daveningService.setSuccessMessage(`The name '${englishName}' has been deleted`);
                    this.activeRow = -1;
                },
                error => {
                    this.daveningService.setErrorMessage(`There was a problem deleting the name "${englishName}".  We recommend refreshing the page`);
                    console.log(error);
                    this.activeRow = -1;
                }
            );
    }

    addDavenfor(newDavenfor: Davenfor) {
        this.daveningService.setLoading(true);

        if (newDavenfor.userEmail != undefined && newDavenfor != undefined) {
            this.httpService.addDavenfor(newDavenfor.userEmail, newDavenfor).pipe(
                finalize(() => this.daveningService.setLoading(false))).subscribe(
                    () => {
                        this.populateGuestDavenfors(newDavenfor.userEmail ?? "");
                        let name = (newDavenfor.nameEnglish == "") ? newDavenfor.nameHebrew : newDavenfor.nameEnglish;
                        this.daveningService.setSuccessMessage(`The name '${name}' has been added successfully`, true);
                        this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                        this.router.navigate(['guest/names']);    //Guest probably wants to add just one name, returning to list             
                    },
                    error => {
                        this.daveningService.setErrorMessage(`We are sorry.  There was an error adding the name "${newDavenfor.nameEnglish}"`);
                        console.log(error);
                    }
                );
        }
        else {
            console.log('Email given is ' + newDavenfor.userEmail + ' and new davenfor is ' + newDavenfor);
            this.daveningService.setLoading(false);
        }
    }

    public editDavenfor(davenfor: Davenfor) {
        davenfor.userEmail = this.guestEmail;
        this.httpService.editDavenfor('user/updatename/' + this.guestEmail, davenfor).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                () => {
                    this.populateGuestDavenfors(this.guestEmail);
                    let name = (davenfor.nameEnglish == "") ? davenfor.nameHebrew : davenfor.nameEnglish;
                    this.daveningService.setSuccessMessage(`The name '${name}' has been updated`, true);
                    this.router.navigate(['guest/names']);
                },
                () => {
                    this.daveningService.setErrorMessage("We are sorry. There was an error when saving the new edits");
                }
            );
    }
}