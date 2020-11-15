import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../shared/models/category.model';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { AdminService } from '../shared/services/admin.service';
import { DaveningService } from '../shared/services/davening.service';
import { HttpService } from '../shared/services/http.service';

@Component({
    selector: 'app-submit-name',
    templateUrl: './submit-name.component.html',
    styleUrls: ['./submit-name.component.css']
})
export class SubmitNameComponent implements OnInit {
    nameForm: FormGroup;
    categories: Category[]; //creating here so it is ready to populate and recognize later
    banimNumber: number; //We need the id in order to refer to it in the html (if value of category input is the one of banim)
    chosenCategoryId = -1;
    guestEmail;
    englishNamePattern = "^[a-zA-Z '\\-\\ ]*$";
    hebrewNamePattern = "^[\\u0590-\\u05fe '\\-]*$";
    chosenCategory: Category;
    spouseEnglishError = false;
    spouseHebrewError = false;

    //declaring form-controls as variables, to shorten reference to them
    name1English: FormControl;
    benbat: FormControl;
    name2English: FormControl;
    name1Hebrew: FormControl;
    benbatHebrew: FormControl;
    name2Hebrew: FormControl;
    spouseName1English: FormControl;
    spouseName2English: FormControl;
    spouseName1Hebrew: FormControl;
    spouseName2Hebrew: FormControl;
    category: FormControl;
    submitterToReceive: FormControl;
    submitterEmail: FormControl;
    banim: Category;


    constructor(public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService) { }

    ngOnInit() {
        this.createFormControls();
        this.createForm();

        //since field is required  but not shown, populate behind the scenes.
        if (!this.adminService.adminLogin) {
            this.submitterEmail.setValue(this.daveningService.guestEmail);
        }

        //Populating category array from Server
        this.categories = this.daveningService.categories;
        this.banimNumber = this.daveningService.findBanim().id;
    }

    createFormControls() {
        this.name1English = new FormControl(null, [Validators.required, Validators.pattern(this.englishNamePattern)]);
        this.benbat = new FormControl('ben');
        this.name2English = new FormControl(null, [Validators.required, Validators.pattern(this.englishNamePattern)]);
        this.name1Hebrew = new FormControl(null, [Validators.required, Validators.pattern(this.hebrewNamePattern)]);
        this.benbatHebrew = new FormControl('בן');
        this.name2Hebrew = new FormControl(null, [Validators.required, Validators.pattern(this.hebrewNamePattern)]);

        //spouse values can be empty or not, depending on category value (if it is banim, and even then optional), as long as they are in the right language 
        //spouse values are initialized as empty string to assist with checkSpouseEnglish() and checkSpouseHebrew(), where we now only need to check if it is an empty string or not.
        this.spouseName1English = new FormControl("", Validators.pattern(this.englishNamePattern));
        this.spouseName2English = new FormControl("", Validators.pattern(this.englishNamePattern));
        this.spouseName1Hebrew = new FormControl("", Validators.pattern(this.hebrewNamePattern));
        this.spouseName2Hebrew = new FormControl("", Validators.pattern(this.hebrewNamePattern));

        this.category = new FormControl("", Validators.required); //default value is 'select category'
        this.submitterToReceive = new FormControl(true);
        this.submitterEmail = new FormControl(null, [Validators.required, Validators.email]);

    }

    createForm() {
        this.nameForm = new FormGroup({
            'name': new FormGroup({
                'english1': this.name1English,
                'benBat': this.benbat,
                'english2': this.name2English,
                'hebrew1': this.name1Hebrew,
                'benBatHebrew': this.benbatHebrew,
                'hebrew2': this.name2Hebrew
            }),
            'spouse': new FormGroup({
                'english1': this.spouseName1English,
                'english2': this.spouseName2English,
                'hebrew1': this.spouseName1Hebrew,
                'hebrew2': this.spouseName2Hebrew
            }),
            'category': this.category,
            'submitterToReceive': this.submitterToReceive,
            'submitterEmail': this.submitterEmail
        });
    }

    onSubmit() {
        let form = this.nameForm; //shortening all references in this function
        const chosenCategory = this.daveningService.getCategory(form.get('category').value);
        const englishName = form.get('name.english1').value + " " + form.get('name.benBat').value + " " + form.get('name.english2').value;
        const hebrewName = form.get('name.hebrew1').value + " " + form.get('name.benBatHebrew').value + " " + form.get('name.hebrew2').value;
        let submitterEmail = form.get('submitterEmail').value;
        let submitterToReceive = form.get('submitterToReceive').value;

        //initialize as empty, only populate if category is banim
        let spouseEnglishName = "";
        let spouseHebrewName = "";
        if (chosenCategory.english === "banim") {
            //overriding an input such as "null בן null"
            //TODO: interpolate with ``
            spouseEnglishName = `${form.get('spouse.english1').value} ben ${form.get('spouse.english2').value}`;
            spouseHebrewName = `${form.get('spouse.hebrew1').value} בן ${form.get('spouse.hebrew2').value}`;
        }

        let formInfo = new SimpleDavenfor(
            chosenCategory,
            submitterEmail,
            hebrewName,
            englishName,
            spouseHebrewName,
            spouseEnglishName,
            submitterToReceive
        );
        console.log(formInfo);

        this.httpService.addDavenfor(formInfo);
    }

    checkSpouseEnglish() {
            if ((!this.spouseName1English.value
            && this.spouseName2English.value)
            ||
            (!this.spouseName2English.value
                && this.spouseName1English.value)) {
            this.spouseEnglishError = true;
        }
        else this.spouseEnglishError = false;
    }

    checkSpouseHebrew() {
             if ((!this.spouseName1Hebrew.value
            && this.spouseName2Hebrew.value)
            ||
            (!this.spouseName2Hebrew.value
                && this.spouseName1Hebrew.value)) {
            this.spouseHebrewError = true;
        }
        else this.spouseHebrewError = false;
    }

    

}
