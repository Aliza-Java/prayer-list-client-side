import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Davenfor } from '../shared/models/davenfor.model';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class GuestService { //A service focusing on guest data and tasks (vs. admin)
    myDavenfors = signal<Davenfor[]>([]);
    optionalGuest = signal('');
    guestEmail = signal(''); //signal to hold the guest email, so it can be used in the template
    davenforToEdit: Davenfor = new Davenfor;
    activeRow: number | null = null;

    constructor(public router: Router,
        public httpService: HttpService,
        public daveningService: DaveningService) {
        this.guestEmail.set(localStorage.getItem("guest") || '');    }


    getCategory(name: string) {
        //double equal sign (instead of triple) since incoming id is a string while category.id is a number.
        return this.daveningService.categories.find(category => category == name);
    }

    sendOtpToGuest(email: string) {
        this.daveningService.loading.set(true);
        this.myDavenfors.set([]);

        this.httpService.sendOtp(email).pipe(
            finalize(() => this.daveningService.loading.set(false))
        ).subscribe(
            () => {
                this.daveningService.serverFine = true;
                this.daveningService.setSuccessMessage(`A 4-digit code has been sent to ${email}. Please enter it below to continue.`, true);
                this.router.navigate(['guest/otp']);
            },
            (error) => {
                if (error.status === 404)
                    this.daveningService.setErrorMessage(`Unknown user ${email}.  Please check your email address spelling, or register with the system admin`, true);
                else
                    this.daveningService.setErrorMessage(`An error occurred. We could not log in with '${email}'`, true);

                this.router.navigate(['guest/names']);
                this.optionalGuest.set(''); //this will show what was in the guest email before
                this.populateGuestDavenfors(); //go back to davenfors of previous name

            });
    }

    loadGuest(code: string) {
        this.daveningService.loading.set(true);
        let data = { username: this.optionalGuest(), password: code };
        this.httpService.verifyOtp(data)
            .pipe(
                finalize(() => {
                    this.daveningService.clearSuccessMessage();
                    this.daveningService.loading.set(false);
                })
            ).subscribe(
                names => {
                    this.daveningService.serverFine = true;
                    this.myDavenfors.set(names);
                    localStorage.setItem("guest", this.optionalGuest()); //in case refreshed
                    this.guestEmail.set(this.optionalGuest()); //save the email in the service
                    this.optionalGuest.set('');
                    this.router.navigate(['guest/names']);
                },
                () => {
                    this.daveningService.setErrorMessage(`An error occurred. We could not log in with '${this.optionalGuest()}'`, true);
                }
            );
    }


    populateGuestDavenfors() {
        this.daveningService.loading.set(true);
        return this.httpService.getDavenfors('user/getmynames/' + this.guestEmail()).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                names => {
                    this.daveningService.serverFine = true;
                    this.myDavenfors.set(names);
                    //buzz the event, so every subscribing component reacts accordingly.
                },
                () => {
                    this.daveningService.setErrorMessage(`We could not retrieve names associated with ${this.guestEmail()}`);
                });
    }

    public deleteDavenfor(davenforId: number, englishName: string) {
        this.daveningService.loading.set(true);
        this.httpService.deleteDavenfor(`user/delete/${davenforId}/${this.guestEmail()}`).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                updatedList => {
                    this.myDavenfors.set(updatedList);
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
        this.daveningService.loading.set(true);

        if (newDavenfor.userEmail != undefined && newDavenfor != undefined) {
            this.httpService.addDavenfor(newDavenfor.userEmail, newDavenfor).pipe(
                finalize(() => this.daveningService.loading.set(false))).subscribe(
                    () => {
                        this.populateGuestDavenfors();
                        let name = (newDavenfor.nameEnglish == "") ? newDavenfor.nameHebrew : newDavenfor.nameEnglish;
                        this.daveningService.setSuccessMessage(`The name '${name}' has been added successfully`, true);
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
            this.daveningService.loading.set(false);
        }
    }

    public editDavenfor(davenfor: Davenfor) {
        davenfor.userEmail = this.guestEmail();
        this.httpService.editDavenfor('user/updatename/' + this.guestEmail(), davenfor).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                () => {
                    this.populateGuestDavenfors();
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