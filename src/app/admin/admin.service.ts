import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, lastValueFrom, Subject, Subscription } from 'rxjs';
import { AdminSettings } from '../shared/models/admin-settings.model';
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

    davenfors: Davenfor[] = [];
    daveners: Davener[] = [];
    weeklyCategory: string = '';
    currentParasha: Parasha = new Parasha();
    defaultParasha: Parasha = new Parasha(-1, "", "", false);
    parashot: Parasha[] = [];
    categories: string[] = [];

    chagim: Parasha[] = [{ "id": 101, "englishName": "Rosh Hashana", "hebrewName": "ראש השנה" },
    { "id": 102, "englishName": "Yom Kippur", "hebrewName": "יום כיפור" },
    { "id": 103, "englishName": "Sukkot", "hebrewName": "סוכות" },
    { "id": 104, "englishName": "Shmini Atzeret", "hebrewName": "שמיני עצרת" },
    { "id": 105, "englishName": "Pesach", "hebrewName": "פסח" },
    { "id": 106, "englishName": "Shavuot", "hebrewName": "שבועות" }
    ];

    davenforToEdit: Davenfor | null = null;

    davenforsChanged = new Subject<Davenfor[]>();
    davenersChanged = new Subject<Davener[]>();
    davenforAdded = new Subject<Boolean>();
    settingsUpdated = new Subject<AdminSettings>();
    adminSettings: AdminSettings = new AdminSettings('', false, 7);
    listsSub: Subscription = new Subscription;

    constructor(public httpService: HttpService,
        public router: Router,
        public daveningService: DaveningService,
        public authService: AuthService) {
        this.listsSub = this.authService.loggedIn.subscribe(
            () => {//Populate all lists only once successful login was made 
                this.populateAdminDavenfors();
                this.populateWeeklyCategory(); //this fills in the default category from DB
                this.populateParashot();
                this.populateAdminSettings();
                this.getDaveners();
            }
        );
    }

    async populateParashot(): Promise<Parasha | null> {
        if (this.parashot?.length > 0) {
            this.currentParasha = this.parashot.find(p => p.current == true) ?? this.defaultParasha;
            //todo - all this in function
            return this.currentParasha;
        }
        else {
            this.daveningService.setLoading(true);

            return this.httpService.getParashot('admin/parashot').pipe(
                finalize(() => this.daveningService.setLoading(false))).toPromise()
                .then(data => {
                    this.parashot = data ?? [];
                    this.currentParasha = this.parashot.find(p => p.current == true) ?? this.defaultParasha;
                    return this.currentParasha;
                })
                .catch(error => {
                    console.error('Error fetching parashot:', error);
                    return null;
                });
        }
    }

    async populateAdminDavenfors() { //requesting all system Davenfors from server
        this.daveningService.setLoading(true);
        this.httpService.getDavenfors('admin/davenfors').pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                names => {
                    this.davenfors = names;
                    this.davenforsChanged.next(names);
                },
                () => {
                    this.daveningService.setErrorMessage("We could not retrieve the names.  Please contact the admin.");
                }
            );
    }

    async populateAdminSettings() {
        if (this.authService.adminLogin) {
            this.daveningService.setLoading(true);
            this.httpService.getAdminSettings(this.authService.adminLogin.email || '').pipe(
                finalize(() => this.daveningService.setLoading(false))).subscribe(
                    response => {
                        this.adminSettings = response;
                        this.settingsUpdated.next(response);
                    },
                    error => {
                        this.daveningService.setErrorMessage("There was a problem retrieving the admin settings");
                        console.log(error);
                    }
                );
        }
    }

    async getDaveners() {
        this.daveningService.setLoading(true);
        this.httpService.getDaveners().pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe((daveners: Davener[]) => {
                this.daveners = daveners;
                this.davenersChanged.next(daveners);
            },
                error => {
                    this.daveningService.setErrorMessage("There was a problem retrieving the users");
                    console.log(error);
                });
    }

    editDavener(davenerToEdit: Davener) {
        this.daveningService.setLoading(true);
        this.httpService.editDavener(davenerToEdit).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                daveners => {
                    this.daveningService.setSuccessMessage(`Changes have been saved`);
                    this.daveners = daveners;
                    this.davenersChanged.next(daveners);
                },
                () => {
                    this.daveningService.setErrorMessage("We are sorry. There was an error saving the new edits");
                }
            );
    }

    deleteDavener(davenerId: number, davenerEmail: string) {
        this.daveningService.setLoading(true);
        this.httpService.deleteDavener(davenerId).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                () => {
                    this.daveningService.setSuccessMessage(`${davenerEmail} has been removed`);
                    this.getDaveners(); //refreshing list reflects deleted item.
                },
                error => {
                    this.daveningService.setErrorMessage(`We are sorry, there was a problem removing "${davenerEmail}" from the davening list`);
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
                    this.daveningService.setSuccessMessage(`${davener.email} has been activated`);
                },
                error => {
                    this.daveningService.setErrorMessage(`An error occurred when activating ${davener.email}`);
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
                    this.daveningService.setSuccessMessage(`${davener.email} has been disactivated`);
                },
                error => {
                    this.daveningService.setErrorMessage(`An error occurred when disactivating ${davener.email}`);
                    console.log(error);
                }
            );
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
                    this.daveningService.setSuccessMessage(`${davener.email} will now receive the davening lists`);
                },
                () => {
                    this.daveningService.setErrorMessage(`We are sorry. There was an error adding ${davener.email}`);
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
                    this.daveningService.setSuccessMessage(`The name '${englishName}' has been deleted`);
                },//refreshing list reflects deleted item.
                () => {
                    this.daveningService.setErrorMessage(`We are sorry.  There was an error deleting ${englishName}`);
                }
            );
    }

    async addDavenfor(basicInfo: SimpleDavenfor): Promise<boolean> { //by default let user know addition was successful. (not if urgent name being sent out)
        const newDavenfor = this.constructNewDavenfor(basicInfo);
        this.daveningService.setLoading(true);

        try {
            const response = await lastValueFrom(this.httpService.addDavenfor(basicInfo.userEmail || "", newDavenfor));
            if (response) {
                this.populateAdminDavenfors();
                this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
                return true;
            }
            else {
                return false;
            }
        } catch (error: any) {
            this.daveningService.setErrorMessage("An error occurred when adding the name");
            console.log(`An error occurred in addDavenfor: ${error.message}`);
            return false;
        }
        finally {
            this.daveningService.setLoading(false);
        }
    }

    editDavenfor(davenfor: Davenfor) {
        this.daveningService.setLoading(true);
        this.httpService.adminEditDavenfor('admin/updatedavenfor', davenfor).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                () => {
                    this.populateAdminDavenfors();
                    //TODO - this doesn't work.  See if can fix
                    this.daveningService.setSuccessMessage(`The name ${davenfor.nameEnglish} has been updated`);
                    this.router.navigate(['admin/names']);
                },
                () => {
                    this.daveningService.setErrorMessage("We are sorry. There was an error when saving the new edits.");
                }
            );
    }

    async populateWeeklyCategory() { // populates current categoryfrom DB
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
        this.httpService.preview(weeklyInfo).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                res => {
                    var win = window.open("", "Preview this week's list", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=630,top=20");
                    if (win) {
                        win.document.open(); // Open the document for writing
                        win.document.write(res); // Write the entire HTML string
                        win.document.close(); // Close the document to signal completion
                        win.resizeTo(660, win.outerWidth);  // Resize after writing the document
                    }
                },
                () => {
                    this.daveningService.setErrorMessage("There was an error generating the preview.");
                }
            );
    }

    async verify(weeklyInfo: Weekly, password: string): Promise<boolean> {
        this.daveningService.setLoading(true);
        try {
            const response = await lastValueFrom(this.httpService.verify(password, this.authService.adminLogin.email || ""));

            if (response) {
                if (confirm('Are you sure you are ready to send out the weekly list to everyone?')) {
                    this.sendWeekly(weeklyInfo);
                    return true;
                }
                else {
                    this.daveningService.setLoading(false);
                    return false;
                }
            }
            else {
                this.daveningService.setErrorMessage("Password is incorrect");
                this.daveningService.setLoading(false);
                return false;
            }
        } catch (error) {
            this.daveningService.setErrorMessage("There was a problem verifying the Admin password");
            console.log(error);
            return false;
        }
    }

    async sendWeekly(weeklyInfo: Weekly) {
        this.httpService.sendWeekly(weeklyInfo).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                () => {
                    this.daveningService.setSuccessMessage("Weekly list has been sent out to active subscribers ");
                },
                error => {
                    this.daveningService.setErrorMessage(error.error.messages[0]);
                    console.log(error.error.messages[0]);
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
            this.addDavenfor(formInfo);
        }

        const urgentDavenfor = this.constructNewDavenfor(formInfo);

        this.httpService.sendUrgent(urgentDavenfor).subscribe(
            () => {
                this.daveningService.setSuccessMessage(`The name ${formInfo.nameEnglish} has been sent out to all subscribers`);
            },
            () => {
                this.daveningService.setErrorMessage(`We are sorry.  The name ${formInfo.nameEnglish} could not be sent to subscribers`);
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
                    this.daveningService.setSuccessMessage("Changes were saved");
                }
                else { //server returned a value (not error) which is not true
                    this.daveningService.setErrorMessage("The system encountered an error, no changes were made.");
                }
            },
            () => {
                this.daveningService.setErrorMessage("The system encountered an error, no changes were made.");
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