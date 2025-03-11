import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, Subscription } from 'rxjs';
import { AdminSettings } from '../shared/models/admin-settings.model';
import { Davener } from '../shared/models/davener.model';
import { Davenfor } from '../shared/models/davenfor.model';
import { Parasha } from '../shared/models/parasha.model';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { Weekly } from '../shared/models/weekly.model';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AdminService implements OnDestroy {  //A service focusing on admin data and tasks (vs. guest)

    davenfors: Davenfor[] = [];
    daveners: Davener[] = [];
    weeklyCategory: string = '';
    currentParasha: Parasha = new Parasha();
    parashot: Parasha[] = [];
    categories: string[] = [];

    chagim: Parasha[] = [{ "id": 1, "englishName": "Rosh Hashana", "hebrewName": "ראש השנה" },
    { "id": 2, "englishName": "Yom Kippur", "hebrewName": "יום כיפור" },
    { "id": 3, "englishName": "Sukkot", "hebrewName": "סוכות" },
    { "id": 4, "englishName": "Shmini Atzeret", "hebrewName": "שמיני עצרת" },
    { "id": 5, "englishName": "Pesach", "hebrewName": "פסח" },
    { "id": 6, "englishName": "Shavuot", "hebrewName": "שבועות" }
    ];

    davenforToEdit: Davenfor | null = null;

    davenforsChanged = new Subject<Davenfor[]>();
    davenersChanged = new Subject<Davener[]>();
    davenforAdded = new Subject<Boolean>();
    settingsUpdated = new Subject<AdminSettings>();
    adminSettings: AdminSettings = new AdminSettings('', false, 7);
    listsSub: Subscription = new Subscription;

    constructor(private http: HttpClient,
        public httpService: HttpService,
        public router: Router,
        public daveningService: DaveningService,
        public authService: AuthService) {
        this.listsSub = this.authService.loggedIn.subscribe(
            () => {//Populate all lists only once successful login was made 
                this.populateAdminDavenfors();
                this.populateWeeklyCategory(); //this fills in the default category from DB
                this.populateAdminSettings();
                this.getDaveners();
            }
        );
    }

    //TODO in future: future fix and organizing, if works well, to move http calls to httpService (without changing functionality)
    async populateParashot(): Promise<Parasha[]> {
        if (this.parashot.length > 0) {
            return Promise.resolve(this.parashot);
        }
        else {
            this.daveningService.setLoading(true);

            return this.http.get<Parasha[]>('http://localhost:8080/dlist/admin/parasha').pipe(
                finalize(() => this.daveningService.setLoading(false))).toPromise()
                .then(data => {
                    this.parashot = data ?? [];
                    console.log(data);
                    return data ?? [];
                })
                .catch(error => {
                    console.error('Error fetching parashot:', error);
                    return [];
                });
        }
    }

    async populateCurrentParasha(): Promise<Parasha> {
        this.daveningService.setLoading(true);
        return this.http.get<Parasha>('http://localhost:8080/dlist/admin/parasha').pipe(
                    finalize(() => this.daveningService.setLoading(false))).toPromise()
            .then(data => {
                this.currentParasha = data ?? new Parasha();
                return data ?? new Parasha();
            })
            .catch(error => {
                console.error('Error fetching current parasha:', error);
                return new Parasha();
            });
    }

    public populateAdminDavenfors() { //requesting all system Davenfors from server
        this.daveningService.setLoading(true);
        this.httpService.getDavenfors('admin/davenfors').pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            names => {
                this.davenfors = names;
                this.davenforsChanged.next(names);
            },
            () => {
                this.daveningService.errorMessage = "We could not retrieve the names.  Please contact the admin.";
            }
        );
    }

    async populateAdminSettings() {
        if (this.authService.adminLogin) {
            this.daveningService.setLoading(true);
            this.httpService.getAdminSettings(this.authService.adminLogin.email || '').pipe(
                finalize(() => this.daveningService.setLoading(false))).subscribe(
                response => {
                    console.log(response);
                    this.adminSettings = response;
                    this.settingsUpdated.next(response);
                },
                error => {
                    this.daveningService.errorMessage = "There was a problem retrieving the admin settings";
                    console.log(error);
                }
            );
        }
    }

    public getDaveners() {
        this.daveningService.setLoading(true);
        this.httpService.getDaveners().pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe((daveners: Davener[]) => {
            this.daveners = daveners;
            this.davenersChanged.next(daveners);
        },
            error => {
                this.daveningService.errorMessage = "There was a problem retrieving the users";
                console.log(error);
            });
    }

    editDavener(davenerToEdit: Davener) {
        this.daveningService.setLoading(true);
        this.httpService.editDavener(davenerToEdit).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            daveners => {
                this.daveners = daveners;
                this.davenersChanged.next(daveners);
            },
            () => {
                this.daveningService.errorMessage = "We are sorry. There was an error saving the new edits.";
            }
        );
    }

    deleteDavener(davenerId: number, davenerEmail: string) {
        this.daveningService.setLoading(true);
        this.httpService.deleteDavener(davenerId).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            () => {
                this.getDaveners(); //refreshing list reflects deleted item.
            },
            error => {
                this.daveningService.errorMessage = `We are sorry, there was a problem removing "${davenerEmail}" from the davening list.`
                console.log(error);
            }
        );
    }

    activateDavener(davener: Davener) {
        this.daveningService.setLoading(true);
        this.httpService.activateDavener(davener).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            () => {
                this.changeToActivate(davener);
            },
            error => {
                this.daveningService.errorMessage = `An error occurred when activating ${davener.email}`;
                console.log(error);
            }
        );
    }

    disactivateDavener(davener: Davener) {
        this.daveningService.setLoading(true);
        this.httpService.disactivateDavener(davener).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            () => {
                this.changeToDisactivate(davener);
            },
            error => {
                this.daveningService.errorMessage = `An error occurred when disactivating ${davener.email}`;
                console.log(error);
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
        this.daveningService.setLoading(true);
        this.httpService.addDavener(davener).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            daveners => {
                this.daveners = daveners;
                this.davenersChanged.next(daveners);
                this.daveningService.successMessage = `${davener.email} will now receive the davening lists.`;
            },
            () => {
                this.daveningService.errorMessage = `We are sorry. There was an error adding ${davener.email}`;
            }
        );
    }

    deleteDavenfor(davenforId: number, englishName: string) {
        this.daveningService.setLoading(true);
        this.httpService.deleteDavenfor('admin/delete/' + davenforId).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            updatedDavenfors => {
                this.davenfors = updatedDavenfors;
                this.davenforsChanged.next(updatedDavenfors);
                this.daveningService.successMessage = `The name '${englishName}' has been deleted`;
            },//refreshing list reflects deleted item.
            () => {
                this.daveningService.errorMessage = `We are sorry.  There was an error deleting ${englishName}`;
            }
        );
    }

    addDavenfor(basicInfo: SimpleDavenfor, announceSuccess = true) { //by default let user know addition was successful. (not if urgent name being sent out)
        const newDavenfor = this.constructNewDavenfor(basicInfo);
        this.daveningService.setLoading(true);
        this.httpService.addDavenfor(basicInfo.userEmail || "", newDavenfor).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            () => {
                this.populateAdminDavenfors();
                this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                if (announceSuccess) {
                    this.daveningService.successMessage = `The name '${basicInfo.nameEnglish}' has been added to the '${basicInfo.category}' list`;
                }
            },
            () => {
                this.daveningService.errorMessage = `We are sorry.  There was an error adding ${basicInfo.nameEnglish}`;
            }
        );
    }

    editDavenfor(davenfor: Davenfor) {
        this.daveningService.setLoading(true);
        this.httpService.adminEditDavenfor('admin/updatedavenfor', davenfor).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            () => {
                this.populateAdminDavenfors();
                this.router.navigate(['admin/names']);
            },
            () => {
                this.daveningService.errorMessage = "We are sorry. There was an error when saving the new edits.";
            }
        );
    }

    populateWeeklyCategory() { // populates current categoryfrom DB
        this.daveningService.setLoading(true);
        this.httpService.getCurrentCategory().pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            incomingCategory => {
                this.weeklyCategory = incomingCategory;
            },
            error => {
                console.log(error);
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
                if (win) {
                    win.document.body.innerHTML = res;
                }
            },
            () => {
                this.daveningService.errorMessage = "There was an error generating the preview.";
            }
        );
    }

    verify(weeklyInfo: Weekly, password: string) {
        this.httpService.verify(password, this.authService.adminLogin.email || "").subscribe(
            response => {
                if (response) {
                    this.sendWeekly(weeklyInfo);
                }
                else {
                    this.daveningService.errorMessage = "Password is incorrect.";
                }
            },
            error => {
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
        if (!formInfo.userEmail) {
            /*If no email was put in, fill in admin email in case it should be sent out. 
            Admin will monitor it. */
            formInfo.userEmail = this.authService.adminLogin.email;
        }
        if (addToWeekly) {
            this.addDavenfor(formInfo, false);
        }

        const urgentDavenfor = this.constructNewDavenfor(formInfo);

        this.httpService.sendUrgent(urgentDavenfor).subscribe(
            () => {
                this.daveningService.successMessage = `The name ${formInfo.nameEnglish} has been sent out to all subscribers`;
            },
            () => {
                this.daveningService.errorMessage = `We are sorry.  The name ${formInfo.nameEnglish} could not be sent to subscribers`;
            }
        );
    }

    getCategory(name: string) {
        //double equal sign (instead of triple) since incoming id is a string while category.id is a number.
        return this.categories.find(category => category == name);
    }

    editSettings(email:string, newNamePrompt:boolean, waitBeforeDeletion:number) {
        this.daveningService.setLoading(true);
        var updatedSettings: AdminSettings = { email, newNamePrompt, waitBeforeDeletion };
        this.httpService.editAdminSettings(updatedSettings).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
            success => {
                if (success) {
                    this.settingsUpdated.next(updatedSettings);
                    this.daveningService.successMessage = "Changes were saved";
                }
                else { //server returned a value (not error) which is not true
                    this.daveningService.errorMessage = "The system encountered an error, no changes were made.";
                }
            },
            () => {
                this.daveningService.errorMessage = "The system encountered an error, no changes were made.";
            }
        );
    }

    private constructNewDavenfor(basicInfo: SimpleDavenfor) { //local method to build a full Davenfor out of a SimpleDavenfor
        const today = new Date().toISOString().split('T')[0]; //used multiple times in the new Davenfor.
        return new Davenfor(
            -1,
            basicInfo.userEmail,
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
    }

    ngOnDestroy() {
        if (this.listsSub) {
            this.listsSub.unsubscribe();
        }
    }
}