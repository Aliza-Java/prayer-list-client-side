import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AdminSettings } from '../shared/models/admin-settings.model';
import { Category } from '../shared/models/category.model';
import { Davener } from '../shared/models/davener.model';
import { Davenfor } from '../shared/models/davenfor.model';
import { Parasha } from '../shared/models/parasha.model';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { Weekly } from '../shared/models/weekly.model';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';
import { AuthService } from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService implements OnDestroy {  //A service focusing on admin data and tasks (vs. guest)

    loading = false;
    davenfors: Davenfor[];
    daveners: Davener[];
    weeklyCategory: Category;
    currentParasha: Parasha;
    parashot: Parasha[];
    categories: Category[];

    chagim: Parasha[] = [{ "id": 1, "englishName": "Rosh Hashana", "hebrewName": "ראש השנה" },
    { "id": 2, "englishName": "Yom Kippur", "hebrewName": "יום כיפור" },
    { "id": 3, "englishName": "Sukkot", "hebrewName": "סוכות" },
    { "id": 4, "englishName": "Shmini Atzeret", "hebrewName": "שמיני עצרת" },
    { "id": 5, "englishName": "Pesach", "hebrewName": "פסח" },
    { "id": 6, "englishName": "Shavuot", "hebrewName": "שבועות" }
    ];

    davenforToEdit: Davenfor = null;

    davenforsChanged = new Subject<Davenfor[]>();
    davenersChanged = new Subject<Davener[]>();
    davenforAdded = new Subject<Boolean>();
    settingsUpdated = new Subject<AdminSettings>();
    adminSettings: AdminSettings = null;
    listsSub: Subscription = null;

    constructor(
        public httpService: HttpService,
        public router: Router,
        public daveningService: DaveningService,
        public authService: AuthService) {
        this.listsSub = this.authService.loggedIn.subscribe(
            () => {//Populate all lists only once successful login was made 
                this.populateAdminDavenfors();
                this.populateWeeklyCategory(); //this fills in the default category from DB
                this.populateAdminSettings();
                this.populateParashot();
                this.populateCategories();
                this.populateCurrentParasha();
                this.getDaveners();
            }
        );
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
                this.daveningService.errorMessage = "We could not retrieve the names.  Please contact the admin.";
                this.loading = false;
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
                    this.daveningService.errorMessage = "There was a problem retrieving the admin settings";
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
                this.daveningService.errorMessage = "There was a problem retriving the list of emails";
                console.log(error);
                this.loading = false;
            });
    }

    editDavener(davenerToEdit) {
        this.loading = true;
        this.httpService.editDavener(davenerToEdit).subscribe(
            daveners => {
                this.daveners = daveners;
                this.loading = false;
                this.davenersChanged.next(daveners);
            },
            error => {
                this.daveningService.errorMessage = "We are sorry. There was an error saving the new edits.";
                this.loading = false;
            }
        );
    }

    deleteDavener(davenerId, davenerEmail) {
        this.loading = true;
        this.httpService.deleteDavener(davenerId).subscribe(
            () => {
                this.getDaveners(); //refreshing list reflects deleted item.
                this.loading = false;
            },
            error => {
                this.daveningService.errorMessage = `We are sorry, there was a problem removing "${davenerEmail}" from the davening list.`
                console.log(error);
                this.loading = false;
            }
        );
    }

    activateDavener(davener: Davener) {
        this.loading = true;
        this.httpService.activateDavener(davener).subscribe(
                () => {
                    this.changeToActivate(davener);
                    this.loading = false;
                },
                error => {
                    this.daveningService.errorMessage = `An error occurred when activating ${davener.email}`;
                    console.log(error);
                    this.loading = false;
                }
            );
    }

    disactivateDavener(davener: Davener) {
        this.loading = true;
        this.httpService.disactivateDavener(davener).subscribe(
            () => {
                this.changeToDisactivate(davener);
                this.loading = false;
            },
            error => {
                this.daveningService.errorMessage = `An error occurred when disactivating ${davener.email}`;
                console.log(error);
                this.loading = false;
            }
        );
    }

    populateCategories() {
        this.loading = true;
        this.httpService.getCategories().subscribe(
            categories => {
                this.categories = categories;
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    populateCurrentParasha() {
        this.loading = true;
        this.httpService.getCurrentParasha().subscribe(
            response => {
                this.currentParasha = response;
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    populateParashot() {
        this.loading = true;
        this.httpService.getParashot().subscribe(
            response => {
                this.parashot = response;
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    getParashot() {
        return this.parashot;
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
                this.daveningService.errorMessage = `We are sorry. There was an error adding ${davener.email}`;
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
                this.daveningService.errorMessage = `We are sorry.  There was an error deleting ${englishName}`;
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
                this.daveningService.errorMessage = `We are sorry.  There was an error adding ${basicInfo.nameEnglish}`;
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
                this.daveningService.errorMessage = "We are sorry. There was an error when saving the new edits.";
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
        return this.weeklyCategory;
    }

    previewList(weeklyInfo: Weekly) {
        this.httpService.preview(weeklyInfo).subscribe(
            res => {
                var win = window.open("", "Preview this week's list", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=" + (screen.height - 20) + ",top=20,left=" + (screen.width - 840));
                win.document.body.innerHTML = res;
            },
            error => {
                this.daveningService.errorMessage = "There was an error generating the preview.";
            }
        );
    }

    verify(weeklyInfo: Weekly, password){
        this.httpService.verify(password, this.authService.adminLogin.email).subscribe(
            response=>{
                if(response){
                    this.sendWeekly(weeklyInfo);
                }
                else{
                    this.daveningService.errorMessage = "Password is incorrect.";
                }
            },
            error=>{
                this.daveningService.errorMessage = "There was a problem verifying the Admin password.";
                console.log(error);
            }
        );
    }

    sendWeekly(weeklyInfo: Weekly) {
        this.httpService.sendWeekly(weeklyInfo).subscribe(
            () => {
                this.daveningService.successMessage = "Weekly list has been sent out to active subscribers ";
            },
            error => {
                this.daveningService.errorMessage = "There was a problem sending out the weekly list. ";
                console.log(error);
            }
        );
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

        this.httpService.sendUrgent(urgentDavenfor).subscribe(
            () => {
                this.daveningService.successMessage = `The name ${formInfo.nameEnglish} has been sent out to all subscribers`;
            },
            error => {
                this.daveningService.errorMessage = `We are sorry.  The name ${formInfo.nameEnglish} could not be sent to subscribers`;
            }
        );
    }

    getCategory(id: number) {
        //double equal sign (instead of triple) since incoming id is a string while category.id is a number.
        return this.categories.find(category => category.id == id);
    }

    public findBanim() {
        let banim = null;
        this.categories.forEach(category => {
            if (category.english === 'banim')
                banim = category;
        });
        return banim;
    }

    editSettings(updatedSettings: AdminSettings) {
        this.loading = true;
        this.httpService.editAdminSettings(updatedSettings).subscribe(
            success => {
                if (success) {
                    this.adminSettings = updatedSettings;
                    this.daveningService.successMessage = "Changes were saved";
                }
                else { //server returned a value (not error) which is not true
                    this.daveningService.errorMessage = "The system encountered an error, no changes were made.";
                }
                this.loading = false;
            },
            error => {
                this.daveningService.errorMessage = "The system encountered an error, no changes were made.";
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

    ngOnDestroy() {
        this.listsSub.unsubscribe();
    }
}