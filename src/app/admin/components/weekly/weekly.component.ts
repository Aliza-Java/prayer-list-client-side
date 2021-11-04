import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
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
    weeklyCategory: Category; //Initialized from DB one time, usually
    selectedCategory: Category; //Can change according to user's selection, affecting davenfor-list
    customWeek = "";
    chag: Parasha;
    parasha: Parasha;
    parashot: Parasha[];
    chagim: Parasha[];
    categories: Category[];
    weekName: string;
    weekType: string;
    changeParasha: boolean = false;
    selectedDavenfors: Davenfor[] = [];
    davenforsChangedSub: Subscription;
    davenfors; //local full list
    disablePreview = false;//will turn to true only if selectedDavenfors proves to be empty. 
    message = "";
    askForPassword = false; //This will show only when admin clicks send, one last verification.
    adminPassword = "";

    constructor(
        public httpService: HttpService,
        public daveningService: DaveningService,
        public adminService: AdminService) { }

    ngOnInit() {
        this.askForPassword = false;
        this.adminPassword = "";
        this.davenfors = this.adminService.davenfors;
        this.adminService.populateParashot();
        this.parashot = this.adminService.getParashot();
        this.adminService.populateWeeklyCategory();
        this.weeklyCategory = this.adminService.getWeeklyCategory();
        this.selectedCategory = this.weeklyCategory;

        this.davenforsChangedSub = this.adminService.davenforsChanged.subscribe(
            updatedList => {
                this.davenfors = updatedList;
                this.refreshDavenfors();
            });

        let currentParashaId = this.adminService.currentParasha.id;
        this.parasha = this.parashot[currentParashaId];

        this.chagim = this.adminService.chagim;
        this.chag = this.chagim[0];

        this.weekName = this.parasha.englishName + " - " + this.parasha.hebrewName;

        this.refreshDavenfors();
    }

    weekChange(value: string) {
        this.weekName = value;
    }

    updateWeekName(isRelevant: boolean, newWeekName: string) {
        if (isRelevant) {
            this.weekName = newWeekName;
        }
    }

    toggleChangeParasha(value: any) {
        this.changeParasha = !this.changeParasha;
    }

    refreshDavenfors() {  //re-selecting from all davenfors by category to populate local davenfors table
        this.disablePreview = false; //start again.  Maybe list now has something. 
        this.selectedDavenfors = []; //clean array to populate newly

        this.davenfors.forEach((davenfor: Davenfor) => {
            if (davenfor.category.english == this.selectedCategory.english) { //specifying english name in case object isn't exactly identical
                this.selectedDavenfors.push(davenfor);
            }
        });
        if (this.selectedDavenfors.length < 1) { //difficulty binding 'disable' to preview button.  Using boolean variable instead.
            this.disablePreview = true;
        }
    }

    send() {
        let weeklyInfo: Weekly = new Weekly(this.parasha.englishName, this.weekName, this.selectedCategory.id, this.message);
        this.httpService.sendWeekly(weeklyInfo).subscribe(
            () => {
                return this.daveningService.successMessage = "Weekly list has been sent out to active subscribers ";
            },
            error => console.log(error)
        );
    }

    preview() {
        if (this.selectedDavenfors.length < 1) {
        }
        let weeklyInfo: Weekly = new Weekly(this.parasha.englishName, this.weekName, this.selectedCategory.id, this.message);
        this.httpService.preview(weeklyInfo);
    }

    verify() {
        //  TODO: change to something like this:  if (this.adminPassword === this.adminService.adminLogin.password) 

        if (this.adminPassword === "pass1") {
            this.send();
        }
        else {
            this.daveningService.errorMessage = "Password is incorrect ";
        }
    }

    requestToSend() {
        this.askForPassword = true;
    }

    ngOnDestroy() {
        if (this.davenforsChangedSub)
            this.davenforsChangedSub.unsubscribe();
    }
}