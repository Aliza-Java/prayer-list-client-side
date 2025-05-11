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
    weekName: string = '';
    selectedParashaId: number = -1;
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
                this.weekName = this.parasha.englishName = '';
            else if (currentParasha != null) {
                this.weekName = currentParasha.englishName + " - " + currentParasha.hebrewName;
                this.selectedParashaId = currentParasha.id ?? 0;
                this.parasha = currentParasha;
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

    weekChange(value: string) { //todo in future: isn't this duplicate of updateWeekName() and updateWeekNameParasha()?
        let numberValue = Number(value);
        if (numberValue > -1)
            this.weekName = this.formatParashaName(numberValue, true);
        else
            this.weekName = value;
    }

    updateWeekName(event: any) { //applies only to chag and custom.  Value should be in both weekName fields (english and full)
        const selectElement = event.target as HTMLSelectElement;
        this.weekName = selectElement.value;
        this.weekNameEnglish = selectElement.value;
    }

    formatParashaName(parashaId: number, full: boolean): string {
        const currentParasha = this.adminService.parashot.find(p => p.id === parashaId);
        if (full)
            return (currentParasha ? `${currentParasha.englishName} - ${currentParasha.hebrewName}` : '');
        else
            return (currentParasha ? `${currentParasha.englishName}` : '');
    }

    updateWeekNameByParasha(event: any) {
        const selectElement = event.target as HTMLSelectElement;
        this.weekName = this.formatParashaName(Number(selectElement.value), true);
        this.weekNameEnglish = this.formatParashaName(Number(selectElement.value), false);
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
        if (this.daveningService.loading)
            return;
        this.readyToSend = true;
        this.daveningService.setLoading(true);
        let weeklyInfo: Weekly = new Weekly('', this.weekName, this.selectedCategory, this.message);
        this.adminService.previewList(weeklyInfo);
    }

    verify() {
        if (this.daveningService.loading)
            return;
        this.readyToSend = true;
        const weeklyInfo = new Weekly(this.weekNameEnglish, this.weekName, this.selectedCategory, this.message);
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