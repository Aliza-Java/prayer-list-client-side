import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminSettings } from '../shared/models/admin-settings.model';
import { Category } from '../shared/models/category.model';
import { Davener } from '../shared/models/davener.model';
import { Davenfor } from '../shared/models/davenfor.model';
import { Signin } from '../shared/models/signin.model';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';
import { AuthService } from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {  //A service focusing on admin data and tasks (vs. guest)

    loading = false;
    davenfors: Davenfor[];
    daveners: Davener[];
    weeklyCategory: Category;
    davenforToEdit: Davenfor = null;

    davenforsChanged = new Subject<Davenfor[]>();
    davenersChanged = new Subject<Davener[]>();
    davenforAdded = new Subject<Boolean>();
    settingsUpdated = new Subject<AdminSettings>();
    adminSettings: AdminSettings = null;

    constructor(public httpService: HttpService, public router: Router, public daveningService: DaveningService, public authService: AuthService) {
        this.populateAdminDavenfors();
        this.populateWeeklyCategory(); //this fills in the default category from DB
        this.populateAdminSettings();
    }

    public populateAdminDavenfors() { //requesting all system Davenfors from server
        this.loading = true;
        this.httpService.getDavenfors('admin/davenfors').subscribe(
            names => {
                this.davenfors = names;
                this.davenforsChanged.next(names);
                this.loading = false;
            },
            error => {
                if (error.status == '404') {
                    this.davenforsChanged.next([]);
                    this.loading = false;
                }
            }
        );
    }

    public populateAdminSettings() {
        if (this.authService.adminLogin) {
            this.loading = true;
            this.httpService.getAdminSettings(this.authService.adminLogin.email).subscribe(
                response => {
                    this.adminSettings = response;
                    this.settingsUpdated.next(response);
                    this.loading = false;
                },
                error => {
                    console.log(error);
                    this.loading = false;
                }
            );
        }
    }

    public getDaveners() {
        this.loading = true;
        this.httpService.getDaveners().subscribe((daveners: Davener[]) => {
            this.daveners = daveners;
            this.davenersChanged.next(daveners);
            this.loading = false;
        },
            error => {
                console.log(error);
                this.loading = false;
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
        this.loading = true;
        this.httpService.addDavener(davener).subscribe(
            daveners => {
                this.daveners = daveners;
                this.davenersChanged.next(daveners);
                this.daveningService.successMessage = `${davener.email} will now receive the davening lists.`;
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    deleteDavenfor(davenforId: number, englishName: string) {
        this.loading = true;
        this.httpService.deleteDavenfor('admin/delete/' + davenforId).subscribe(
            updatedDavenfors => {
                this.davenfors = updatedDavenfors;
                this.davenforsChanged.next(updatedDavenfors);
                this.daveningService.successMessage = `The name '${englishName}' has been deleted`;
                this.loading = false;
            },//refreshing list reflects deleted item.
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    addDavenfor(basicInfo: SimpleDavenfor, announceSuccess = true) { //by default let user know addition was successful. (not if urgent name being sent out)
        const newDavenfor = this.constructNewDavenfor(basicInfo);
        this.loading = true;
        this.httpService.addDavenfor(basicInfo.submitterEmail, newDavenfor).subscribe(
            () => {
                this.populateAdminDavenfors();
                this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                if (announceSuccess) {
                    this.daveningService.successMessage = `The name '${basicInfo.nameEnglish}' has been added to the '${basicInfo.category.english}' list`;
                }
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    editDavenfor(davenfor: Davenfor) {
        this.loading = true;
        this.httpService.adminEditDavenfor('admin/updatedavenfor', davenfor).subscribe(
            () => {
                this.populateAdminDavenfors();
                this.router.navigate(['admin/names']);
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    populateWeeklyCategory() { // populates current categoryfrom DB
        this.loading = true;
        this.httpService.getCurrentCategory().subscribe(
            incomingCategory => {
                this.weeklyCategory = incomingCategory;
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    getWeeklyCategory() {
        return this.daveningService.getCategory(this.weeklyCategory.id); //this.categories starts from 0-4.  
    }

    getWeekyCategory() {
        return this.weeklyCategory;
    }

    sendUrgent(formInfo: SimpleDavenfor, addToWeekly: boolean) {
        if (!formInfo.submitterEmail) {
            /*If no email was put in, fill in admin email in case it should be sent out. 
            Admin will monitor it. */
            formInfo.submitterEmail = this.authService.adminLogin.email;
        }
        if (addToWeekly) {
            this.addDavenfor(formInfo, false);
        }

        const urgentDavenfor = this.constructNewDavenfor(formInfo);

        console.log(urgentDavenfor.submitterEmail);
        this.httpService.sendUrgent(urgentDavenfor).subscribe(
            () => {
                this.daveningService.successMessage = `The name ${formInfo.nameEnglish} was sent out to all subscribers.`;
            },
            error => console.log(error)
        );
    }

    editSettings(updatedSettings: AdminSettings) {
        this.loading = true;
        const errorMessage = "The system encountered an error, no changes were made."
        this.httpService.editAdminSettings(updatedSettings).subscribe(
            success => {
                if (success) {
                    this.authService.adminLogin = updatedSettings;
                    this.daveningService.successMessage = "Changes were saved";
                }
                else {
                    this.daveningService.errorMessage = errorMessage;
                }
                this.loading = false;
            },
            error => {
                this.daveningService.errorMessage = errorMessage;
                this.loading = false;
            }
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