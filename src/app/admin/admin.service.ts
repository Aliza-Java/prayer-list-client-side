import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, lastValueFrom, Subject, Subscription } from 'rxjs';
import { AdminSettings } from '../shared/models/admin-settings.model';
import { Davener } from '../shared/models/davener.model';
import { Davenfor } from '../shared/models/davenfor.model';
import { Parasha } from '../shared/models/parasha.model';
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
    settingsUpdated = new Subject<AdminSettings>();
    adminSettings: AdminSettings = new AdminSettings('', false, 7);
    listsSub: Subscription = new Subscription;

    constructor(public httpService: HttpService,
        public router: Router,
        public daveningService: DaveningService,
        public authService: AuthService) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const email = this.authService.getEmailFromToken(token);
            if (email != null) {
                this.authService.loggedIn.next(true);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("email", email || '');
            }
        }

        this.listsSub = this.authService.loggedIn.subscribe(
            () => {//Populate all lists only once successful login was made 
                this.populateAdminDavenfors();
                this.populateWeeklyCategory(); //this fills in the default category from DB
                this.populateParashot();
                this.populateAdminSettings();
                this.getDaveners();
                this.router.navigate(['admin']);
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
            this.daveningService.loading.set(true);

            return this.httpService.getParashot('admin/parashot').pipe(
                finalize(() => this.daveningService.loading.set(false))).toPromise()
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

    async populateAdminDavenfors(): Promise<Davenfor[]> { //requesting all system Davenfors from server
        try {
            const names = await lastValueFrom(
                this.httpService.getDavenfors('admin/davenfors').pipe(
                    finalize(() => this.daveningService.loading.set(false))
                ));
            this.davenfors = names;
            this.davenforsChanged.next(names);
            return names;
        } catch (error) {
            return [];
        }
    }

    async populateAdminSettings() {
        if (this.authService.adminLogin) {
            this.daveningService.loading.set(true);
            this.httpService.getAdminSettings(this.authService.adminLogin.email || '').pipe(
                finalize(() => this.daveningService.loading.set(false))).subscribe(
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
        this.daveningService.loading.set(true);
        this.httpService.getDaveners().pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe((daveners: Davener[]) => {
                this.daveners = daveners;
                this.davenersChanged.next(daveners);
            },
                error => {
                    this.daveningService.setErrorMessage("There was a problem retrieving the users");
                    console.log(error);
                });
    }

    editDavener(davenerToEdit: Davener) {
        this.daveningService.loading.set(true);
        this.httpService.editDavener(davenerToEdit).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
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
        this.daveningService.loading.set(true);
        this.httpService.deleteDavener(davenerId).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
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
        this.daveningService.loading.set(true);
        this.httpService.activateDavener(davener).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
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

    deactivateDavener(davener: Davener) {
        this.daveningService.loading.set(true);
        this.httpService.deactivateDavener(davener).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                () => {
                    this.changeToDeactivate(davener);
                    this.daveningService.setSuccessMessage(`${davener.email} has been deactivated`);
                },
                error => {
                    this.daveningService.setErrorMessage(`An error occurred when disactivating ${davener.email}`);
                    console.log(error);
                }
            );
    }

    changeToDeactivate(davener: Davener) {
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
        this.daveningService.loading.set(true);
        this.httpService.addDavener(davener).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                daveners => {
                    this.daveners = daveners;
                    this.davenersChanged.next(daveners);
                    if (davener.active)
                        this.daveningService.setSuccessMessage(`${davener.email} will now receive the davening lists`);
                    else
                        this.daveningService.setSuccessMessage(`${davener.email} has been added to our database, but will not receive the lists until activated`);
                },
                () => {
                    this.daveningService.setErrorMessage(`We are sorry. There was an error adding ${davener.email}`);
                }
            );
    }

    deleteDavenfor(davenforId: number, name: string) {
        this.daveningService.loading.set(true);
        this.httpService.deleteDavenfor('admin/delete/' + davenforId).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                updatedDavenfors => {
                    this.davenfors = updatedDavenfors;
                    this.davenforsChanged.next(updatedDavenfors);
                    this.daveningService.setSuccessMessage(`The name '${name}' has been deleted`);
                },//refreshing list reflects deleted item.
                () => {
                    this.daveningService.setErrorMessage(`We are sorry.  There was an error deleting ${name}`);
                }
            );
    }

    async addDavenfor(newInfo: Davenfor): Promise<boolean> { //by default let user know addition was successful. (not if urgent name being sent out)
        this.daveningService.loading.set(true);

        try {
            const response = await lastValueFrom(this.httpService.addDavenfor(newInfo.userEmail || "", newInfo));
            if (response) {
                this.populateAdminDavenfors();
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
            this.daveningService.loading.set(false);
        }
    }

    editDavenfor(davenfor: Davenfor) {
        this.daveningService.loading.set(true);
        this.httpService.adminEditDavenfor('admin/updatedavenfor', davenfor).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                () => {
                    this.populateAdminDavenfors();
                    //TODO - this doesn't work.  See if can fix
                    let name = (davenfor.nameEnglish == "") ? davenfor.nameHebrew : davenfor.nameEnglish;
                    this.daveningService.setSuccessMessage(`The name '${name}' has been updated`, true);
                    this.router.navigate(['admin/names']);
                },
                () => {
                    this.daveningService.setErrorMessage("We are sorry. There was an error when saving the new edits.");
                }
            );
    }

    async populateWeeklyCategory() { // populates current categoryfrom DB
        this.daveningService.loading.set(true);
        this.httpService.getCurrentCategory().pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
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
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                res => {
                    var win = window.open("", "Preview this week's list", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=640,top=20");
                    if (win) {
                        win.document.open(); // Open the document for writing
                        win.document.write(res); // Write the entire HTML string
                        win.document.close(); // Close the document to signal completion
                        win.resizeTo(670, win.outerWidth);  // Resize after writing the document
                    }
                },
                () => {
                    this.daveningService.setErrorMessage("There was an error generating the preview.");
                }
            );
    }

    async verify(weeklyInfo: Weekly, password: string): Promise<boolean> {
        this.daveningService.loading.set(true);
        try {
            const response = await lastValueFrom(this.httpService.verify(password, this.authService.adminLogin.email || ""));

            if (response) {
                if (confirm('Are you sure you are ready to send out the weekly list to everyone?')) {
                    this.sendWeekly(weeklyInfo);
                    return true;
                }
                else {
                    this.daveningService.loading.set(false);
                    return false;
                }
            }
            else {
                this.daveningService.setErrorMessage("Password is incorrect");
                this.daveningService.loading.set(false);
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
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                () => {
                    this.daveningService.setSuccessMessage("Weekly list has been sent out to active subscribers ");
                },
                error => {
                    this.daveningService.setErrorMessage(error.error.messages[0]);
                    console.log(error.error.messages[0]);
                }
            );
    }

    sendUrgent(urgentDf: Davenfor) {
        if (this.daveningService.loading())
            return;

        if (!urgentDf.userEmail) {
            /*If no email was put in, fill in admin email in case it should be sent out. 
            Admin will monitor it. */
            urgentDf.userEmail = this.authService.adminLogin.email;
        }
        else { //if the email is not empty, admin asked that it be added to list
            this.addDavenfor(urgentDf);
        }

        this.daveningService.loading.set(true);

        return this.httpService.sendUrgent(urgentDf).pipe(
            finalize(() => this.daveningService.loading.set(false))
        );
    }

    getCategory(name: string) {
        //double equal sign (instead of triple) since incoming id is a string while category.id is a number.
        return this.categories.find(category => category == name);
    }

    editSettings(email: string, newNamePrompt: boolean, waitBeforeDeletion: number) {
        this.daveningService.loading.set(true);
        var updatedSettings: AdminSettings = { email, newNamePrompt, waitBeforeDeletion };
        this.httpService.editAdminSettings(updatedSettings).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
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

    ngOnDestroy() {
        if (this.listsSub) {
            this.listsSub.unsubscribe();
        }
    }
}