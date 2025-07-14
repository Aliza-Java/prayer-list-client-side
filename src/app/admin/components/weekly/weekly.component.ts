import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { Parasha } from 'src/app/shared/models/parasha.model';
import { Weekly } from 'src/app/shared/models/weekly.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AdminService } from '../../admin.service';
@Component({
    selector: 'app-weekly',
    templateUrl: './weekly.component.html',
    styleUrls: ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit, OnDestroy {
    selectedCategory: string = ''; //Can change according to user's selection, affecting davenfor-list
    customWeek = '';
    chag: Parasha = new Parasha;
    parashot: Parasha[] = [];
    chagim: Parasha[] = [];
    categories: string[] = [];
    weekNameEnglish: string = '';
    weekNameHebrew: string = '';
    weekName: string = '';
    selectedParasha: Parasha = new Parasha;
    parasha: Parasha = new Parasha;
    weekType: string = '';
    changeParasha: boolean = false;
    radioChosen: string = 'parashaRadio';
    selectedDavenfors: Davenfor[] = [];
    davenforsChangedSub: Subscription = new Subscription;
    davenfors: Davenfor[] = []; //local full list
    noDavenfors = false;//will turn to true only if selectedDavenfors proves to be empty. 
    message = '';
    askForPassword = false; //This will show only when admin clicks send, one last verification.
    adminPassword = '';
    noUsers: boolean = false;
    readyToSend: boolean = false; //differentiate between first loading (no spinner) and loading when sending
    sentOnce: boolean = false; //after first send can't send again (unless return to tab)
    finishedLoading: boolean = false;

    constructor(
        public httpService: HttpService,
        public daveningService: DaveningService,
        public adminService: AdminService) { }

    ngOnInit() {
        this.finishedLoading = false;
        this.daveningService.populateCategories().then(data => {
            this.categories = data;
            this.adminService.getDaveners().then(() => {
                if (this.adminService.daveners.filter((d) => d.active).length == 0)
                    this.noUsers = true;
            });

            this.adminService.populateWeeklyCategory().then(() => {
                this.selectedCategory = this.adminService.weeklyCategory;
                this.adminService.populateAdminDavenfors().then(() => {
                    this.refreshDavenfors();
                    this.finishedLoading = true;
                });
            });
        });

        this.adminService.populateParashot().then(currentParasha => {
            if (!currentParasha || currentParasha.id == undefined || currentParasha.id < 0)
                this.weekName = this.parasha.englishName = this.parasha.hebrewName = '';
            else if (currentParasha != null) {
                this.weekName = currentParasha.englishName + " - " + currentParasha.hebrewName;
                this.selectedParasha = currentParasha ?? new Parasha;
                this.parasha = currentParasha;
                this.weekNameEnglish = currentParasha.englishName ?? '';
                this.weekNameHebrew = currentParasha.hebrewName ?? '';
            }
        });
        this.askForPassword = false;
        this.adminPassword = "";

        this.chagim = this.adminService.chagim;
        this.chag = this.chagim?.[0];

            this.davenforsChangedSub = this.adminService.davenforsChanged.subscribe(
                updatedList => {
                    this.davenfors = updatedList;
                    this.refreshDavenfors();
                });
    }

    updateParasha() {
        this.weekName = this.formatParashaName(this.selectedParasha.id || 0, true, true);
        this.weekNameEnglish = this.formatParashaName(this.selectedParasha.id || 0, true, false);
        this.weekNameHebrew = this.formatParashaName(this.selectedParasha.id || 0, false, true);
    }

    updateChag() {
        if (this.chag == undefined)
            this.chag = this.adminService.chagim[0];
        this.weekName = this.formatParashaName(this.chag.id ?? -1 , true, true);
        this.weekNameEnglish = this.chag.englishName ?? '';
        this.weekNameHebrew = this.chag.hebrewName ?? '';
    }

    updateCustom(value : string) { //applies only to custom.
        this.weekName = this.weekNameEnglish = value;
        this.weekNameHebrew = '';
    }

    formatParashaName(parashaId: number, english: boolean, hebrew: boolean): string {
        let currentParasha;
        if (parashaId < 100)
            currentParasha = this.adminService.parashot.find(p => p.id === parashaId);
        else
            currentParasha = this.adminService.chagim.find(p => p.id === parashaId);

        if (english && !hebrew)
            return currentParasha?.englishName || '';
        if (hebrew && !english)
            return currentParasha?.hebrewName || '';
        if (english && hebrew)
            return (currentParasha ? `${currentParasha.englishName} - ${currentParasha.hebrewName}` : '');
        
        return '';
    }

    emphasize(radioName: string) {
        this.radioChosen = radioName;
    }

    toggleChangeParasha() {
        this.changeParasha = !this.changeParasha;
    }

    refreshDavenfors() {  //re-selecting from all davenfors by category to populate local davenfors table
        this.noDavenfors = false; //start again.  Maybe list now has something. 
        this.selectedDavenfors = []; //clean array to populate newly

        this.davenfors.forEach((davenfor: Davenfor) => {
            if (davenfor.category == this.selectedCategory) { //specifying english name in case object isn't exactly identical
                this.selectedDavenfors.push(davenfor);
            }
        });
        if (this.selectedDavenfors.length < 1) { //difficulty binding 'disable' to preview button.  Using boolean variable instead.
            this.noDavenfors = true;
        }
    }

    preview() {
        if (this.daveningService.loading())
            return;
        this.readyToSend = true;
        this.daveningService.loading.set(true);
        const weekNameEnglish = this.weekNameEnglish ?? "";
        const weekNameHebrew = this.weekNameHebrew ?? "";
        const weeklyInfo = new Weekly(weekNameEnglish, weekNameHebrew, this.selectedCategory, this.message);
        this.adminService.previewList(weeklyInfo);
    }

    verify() {
        if (this.daveningService.loading())
            return;
        this.readyToSend = true;
        const weekNameEnglish = this.weekNameEnglish ?? "";
        const weekNameHebrew = this.weekNameHebrew ?? "";
        const weeklyInfo = new Weekly(weekNameEnglish, weekNameHebrew, this.selectedCategory, this.message);
        this.adminService.verify(weeklyInfo, this.adminPassword).then(
            (response: boolean) => {
                if (response) {
                    this.adminPassword = '';
                    this.askForPassword = false;
                    this.sentOnce = true;
                }
                else { //password was wrong, try again
                    this.adminPassword = '';
                }
            }).catch(
                () => {
                    this.adminPassword = '';
                });
    }

    requestToSend() {
        this.askForPassword = true;
    }

    cancelPass() {
        this.askForPassword = false;
        this.adminPassword = '';
    }

    ngOnDestroy() {
        if (this.davenforsChangedSub)
            this.davenforsChangedSub.unsubscribe();
    }
}