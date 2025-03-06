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
    weeklyCategory: string = ''; //Initialized from DB one time, usually
    selectedCategory: string = ''; //Can change according to user's selection, affecting davenfor-list
    customWeek = '';
    chag: Parasha = new Parasha;
    parasha: Parasha = new Parasha;
    parashot: Parasha[] = [];
    chagim: Parasha[] = [];
    categories: string[] = [];
    weekName: string = '';
    weekType: string = '';
    changeParasha: boolean = false;
    selectedDavenfors: Davenfor[] = [];
    davenforsChangedSub: Subscription = new Subscription;
    davenfors: Davenfor[] = []; //local full list
    disablePreview = false;//will turn to true only if selectedDavenfors proves to be empty. 
    message = '';
    askForPassword = false; //This will show only when admin clicks send, one last verification.
    adminPassword = '';

    constructor(
        public httpService: HttpService,
        public daveningService: DaveningService,
        public adminService: AdminService) { }

    async ngOnInit() {
        this.categories = await this.daveningService.populateCategories();      
        this.parashot = await this.adminService.populateParashot();
        this.parasha = await this.adminService.populateCurrentParasha();
        
        this.askForPassword = false;
        this.adminPassword = "";
        this.davenfors = this.adminService.davenfors;
        this.adminService.populateWeeklyCategory();
        this.weeklyCategory = this.adminService.getWeeklyCategory();
        this.selectedCategory = this.weeklyCategory;

        this.davenforsChangedSub = this.adminService.davenforsChanged.subscribe(
            updatedList => {
                this.davenfors = updatedList;
                this.refreshDavenfors();
            });

        this.chagim = this.adminService.chagim;
        this.chag = this.chagim[0];

        this.weekName = this.parasha.englishName + " - " + this.parasha.hebrewName;

        this.refreshDavenfors();
    }

    weekChange(value: string) {
        this.weekName = value;
    }

    updateWeekName(isRelevant: boolean, event: any) {
        const selectElement = event.target as HTMLSelectElement;
        let newWeekName = selectElement.value;
        if (isRelevant) {
            this.weekName = newWeekName;
        }
    }

    toggleChangeParasha() {
        this.changeParasha = !this.changeParasha;
    }

    refreshDavenfors() {  //re-selecting from all davenfors by category to populate local davenfors table
        this.disablePreview = false; //start again.  Maybe list now has something. 
        this.selectedDavenfors = []; //clean array to populate newly

        this.davenfors.forEach((davenfor: Davenfor) => {
            if (davenfor.category == this.selectedCategory) { //specifying english name in case object isn't exactly identical
                this.selectedDavenfors.push(davenfor);
            }
        });
        if (this.selectedDavenfors.length < 1) { //difficulty binding 'disable' to preview button.  Using boolean variable instead.
            this.disablePreview = true;
        }
    }

    send() {
        let weeklyInfo: Weekly = new Weekly(this.parasha.englishName, this.weekName, this.selectedCategory, this.message);
        this.adminService.sendWeekly(weeklyInfo);
    }

    preview() {
        if (this.selectedDavenfors.length < 1) {
        }
        let weeklyInfo: Weekly = new Weekly(this.parasha.englishName, this.weekName, this.selectedCategory, this.message);
        this.adminService.previewList(weeklyInfo);
    }

    verify() {
        const weeklyInfo = new Weekly(this.parasha.englishName, this.weekName, this.selectedCategory, this.message);
        this.adminService.verify(weeklyInfo, this.adminPassword);
    }

    requestToSend() {
        this.askForPassword = true;
    }

    ngOnDestroy() {
        if (this.davenforsChangedSub)
            this.davenforsChangedSub.unsubscribe();
    }
}