import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Admin } from '../shared/models/admin.model';
import { Category } from '../shared/models/category.model';
import { Davener } from '../shared/models/davener.model';
import { Davenfor } from '../shared/models/davenfor.model';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {  //A service focusing on admin data and tasks (vs. guest)

    adminLogin: Admin = null;
    davenfors: Davenfor[];
    daveners: Davener[];
    weeklyCategory: Category;

    davenforsChanged = new Subject<Davenfor[]>();
    davenersChanged = new Subject<Davener[]>();
    davenforAdded = new Subject<Boolean>();


    constructor(public httpService: HttpService, public router: Router, public daveningService: DaveningService) {
        this.populateAdminDavenfors();
        this.populateWeeklyCategory(); //this fills in the default category from DB
    }

    public login(email: string, password: string) {
        this.httpService.login(email, password).subscribe(response => {
            this.adminLogin = response;
            this.router.navigate(['admin/']);
        },
            error => {
                if(error.error.code == "NOT_ADMIN_EMAIL"){
                    this.daveningService.errorMessage = "Check your email and password again. ";
                }
                console.log(error);
            });
    }

    public populateAdminDavenfors() { //requesting all system Davenfors from server
        this.httpService.getDavenfors('admin/davenfors').subscribe(
            names => {
                this.davenfors = names;
                this.davenforsChanged.next(names);
            },
            error => {
                if (error.status == '404') {
                    this.davenforsChanged.next([]);
                }
            }
        );
    }

    public returnDavenfors() { //returning system Davenfors to anyone requesting.
        return this.davenfors.slice();
    }

    public getDaveners() {
        this.httpService.getDaveners().subscribe((daveners: Davener[]) => {
            this.daveners = daveners;
            this.davenersChanged.next(daveners);
        },
            error => {
                console.log(error);
            });
    }

    changeToDisactivate(davener: Davener) {
        const index = this.daveners.indexOf(davener);
        this.daveners[index].active = false;
        this.davenersChanged.next(this.daveners);
    }

    changeToActivate(davener: Davener) {
        const index = this.daveners.indexOf(davener);
        this.daveners[index].active = true;
        this.davenersChanged.next(this.daveners);
    }

    addDavener(davener: Davener) {
        this.httpService.addDavener(davener).subscribe(
            daveners => {
                this.daveners = daveners;
                this.davenersChanged.next(daveners);
                this.daveningService.successMessage = `${davener.email} will now receive the davening lists.`;
            },
            error => console.log(error)
        );
    }

    deleteDavenfor(davenforId: number, englishName: string) {
        this.httpService.deleteDavenfor('admin/delete/' + davenforId).subscribe(
            updatedDavenfors => {
                this.davenfors = updatedDavenfors;
                this.davenforsChanged.next(updatedDavenfors);
                this.daveningService.successMessage = `The name '${englishName}' has been deleted`;

            },//refreshing list reflects deleted item.
            error => { console.log(error) }
        );
    }

    addDavenfor(basicInfo: SimpleDavenfor, announceSuccess = true) { //by default let user know addition was successful. (not if urgent name being sent out)
        const newDavenfor = this.constructNewDavenfor(basicInfo);

        this.httpService.addDavenfor(basicInfo.submitterEmail, newDavenfor).subscribe(
            () => {
                this.populateAdminDavenfors();
                this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                if (announceSuccess) {
                    this.daveningService.successMessage = `The name '${basicInfo.nameEnglish}' has been added to the '${basicInfo.category.english}' list`;
                }
            },
            error => { console.log(error) }
        );
    }

    editDavenfor(davenfor: Davenfor) {
        this.httpService.editDavenfor('updatename/' + this.adminLogin.email, davenfor).subscribe(
            response => { console.log(response) },
            error => { console.log(error) }
        );
    }

    populateWeeklyCategory() { // populates current categoryfrom DB
        this.httpService.getCurrentCategory().subscribe(
            incomingCategory => {
                this.weeklyCategory = incomingCategory;
            },
            error => console.log(error)
        );
    }

    getWeeklyCategory() { //need to store weekly category like this, pointing to array
        return this.daveningService.categories[(this.weeklyCategory.id) - 1]; //this.categories starts from 0-4.  
    }

    getWeekyCategory() {
        return this.weeklyCategory;
    }

    sendUrgent(formInfo: SimpleDavenfor, addToWeekly: boolean) {
        if (!formInfo.submitterEmail) {
            /*If no email was put in, fill in admin email in case it should be sent out. 
            Admin will monitor it. */
            formInfo.submitterEmail = this.adminLogin.email;
        }
        if (addToWeekly) {
            this.addDavenfor(formInfo, false);
        }

        const urgentDavenfor = this.constructNewDavenfor(formInfo);

        console.log(urgentDavenfor.submitterEmail);
        this.httpService.sendUrgent(urgentDavenfor).subscribe(
            success => {
                this.daveningService.successMessage = `The name ${formInfo.nameEnglish} was sent out to all subscribers.`;
            },
            error => console.log(error)
        );

    }

    private constructNewDavenfor(basicInfo: SimpleDavenfor) { //local method to build a full Davenfor out of a SimpleDavenfor
        const today = new Date().toISOString().split('T')[0]; //used multiple times in the new Davenfor.
        return new Davenfor(
            -1,
            basicInfo.submitterEmail,
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
    }
}