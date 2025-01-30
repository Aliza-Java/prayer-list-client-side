import { Component, OnInit } from '@angular/core';
import { SimpleDavenfor } from 'src/app/shared/models/simple-davenfor.model';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/guest/guest.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-urgent',
    templateUrl: './urgent.component.html',
    styleUrls: ['./urgent.component.css']
})
export class UrgentComponent implements OnInit {

    nameForm: UntypedFormGroup = new UntypedFormGroup({});
    categories: string[] = []; //creating here so it is ready to populate and recognize later
    banimNumber: number = 0; //We need the id in order to refer to it in the html (if value of category input is the one of banim)
    chosenCategory: string = '';
    spouseEnglishError = false;
    spouseHebrewError = false;

    //declaring form-controls as variables, to shorten reference to them
    name1English: UntypedFormControl = new UntypedFormControl;
    benbat: UntypedFormControl = new UntypedFormControl
    name2English: UntypedFormControl = new UntypedFormControl
    name1Hebrew: UntypedFormControl = new UntypedFormControl
    benbatHebrew: UntypedFormControl = new UntypedFormControl
    name2Hebrew: UntypedFormControl = new UntypedFormControl
    spouseName1English: UntypedFormControl = new UntypedFormControl
    spouseName2English: UntypedFormControl = new UntypedFormControl
    spouseName1Hebrew: UntypedFormControl = new UntypedFormControl
    spouseName2Hebrew: UntypedFormControl = new UntypedFormControl
    category: UntypedFormControl = new UntypedFormControl
    submitterEmail: UntypedFormControl = new UntypedFormControl
    addToWeekly: UntypedFormControl = new UntypedFormControl


    constructor(
        public guestService: GuestService,
        public daveningService: DaveningService,
        public httpService: HttpService,
        public adminService: AdminService,
        public router: Router) { }

    ngOnInit() {
        this.createFormControls();
        this.setForm();

        //Populating category array from Server
        this.categories = this.adminService.categories;
    }

    createFormControls() {
        this.name1English = new UntypedFormControl(null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]);
        this.benbat = new UntypedFormControl('ben');
        this.name2English = new UntypedFormControl(null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]);
        this.name1Hebrew = new UntypedFormControl(null, [Validators.required, Validators.pattern(this.daveningService.hebrewNamePattern)]);
        this.benbatHebrew = new UntypedFormControl('בן');
        this.name2Hebrew = new UntypedFormControl(null, [Validators.required, Validators.pattern(this.daveningService.hebrewNamePattern)]);

        //spouse values can be empty or not, depending on category value (if it is banim, and even then optional), as long as they are in the right language 
        //spouse values are initialized as empty string to assist with checkSpouseEnglish() and checkSpouseHebrew(), where we now only need to check if it is an empty string or not.
        this.spouseName1English = new UntypedFormControl("", Validators.pattern(this.daveningService.englishNamePattern));
        this.spouseName2English = new UntypedFormControl("", Validators.pattern(this.daveningService.englishNamePattern));
        this.spouseName1Hebrew = new UntypedFormControl("", Validators.pattern(this.daveningService.hebrewNamePattern));
        this.spouseName2Hebrew = new UntypedFormControl("", Validators.pattern(this.daveningService.hebrewNamePattern));

        this.category = new UntypedFormControl("", Validators.required); //default value is 'select category'
        this.addToWeekly = new UntypedFormControl(false);
        this.submitterEmail = new UntypedFormControl(null, Validators.email);

    }

    setForm() {
        this.nameForm = new UntypedFormGroup({
            'name': new UntypedFormGroup({
                'english1': this.name1English,
                'benBat': this.benbat,
                'english2': this.name2English,
                'hebrew1': this.name1Hebrew,
                'benBatHebrew': this.benbatHebrew,
                'hebrew2': this.name2Hebrew
            }),
            'spouse': new UntypedFormGroup({
                'english1': this.spouseName1English,
                'english2': this.spouseName2English,
                'hebrew1': this.spouseName1Hebrew,
                'hebrew2': this.spouseName2Hebrew
            }),
            'category': this.category,
            'addToWeekly': this.addToWeekly,
            'submitterEmail': this.submitterEmail
        });
    }

    onSubmit() {
        if (confirm('Are you sure? This name will be sent out to all email subscribers.')) {
            /*If spouse name will be full and valid, will populate later.  
            Initializing before 'banim' condition so that recognized in 'formInfo' population below*/
            let spouseEnglishFull = "";
            let spouseHebrewFull = "";

            let form = this.nameForm; //shortening all references in this function
            const chosenCategory = this.adminService.getCategory(form.get('category')?.value);
            const englishName = form.get('name.english1')?.value + " " + form.get('name.benBat')?.value + " " + form.get('name.english2')?.value;
            const hebrewName = form.get('name.hebrew1')?.value + " " + form.get('name.benBatHebrew')?.value + " " + form.get('name.hebrew2')?.value;
            let submitterEmail = form.get('submitterEmail')?.value;

            let addToWeekly = form.get('addToWeekly')?.value;

            if (chosenCategory == "banim") {
                //overriding an input such as "null בן null", filling only if have name in both parts of spouse name. (English and Hebrew independent)

                let spouseEnglish1 = form.get('spouse.english1')?.value;
                let spouseEnglish2 = form.get('spouse.english2')?.value;
                let spouseHebrew1 = form.get('spouse.hebrew1')?.value;
                let spouseHebrew2 = form.get('spouse.hebrew2')?.value;

                if (spouseEnglish1 && spouseEnglish2)
                    spouseEnglishFull = `${spouseEnglish1} ben ${spouseEnglish2}`; //It must be ben, as it is the husband

                if (spouseHebrew1 && spouseHebrew2)
                    spouseHebrewFull = `${spouseHebrew2} בן ${spouseHebrew1}`;
            }

            let formInfo = new SimpleDavenfor(
                chosenCategory,
                submitterEmail,
                hebrewName,
                englishName,
                spouseHebrewFull,
                spouseEnglishFull,
                true //submitter to receive, by default inserting true (if is added to weekly list)
            );

            /*
            addName will be taken care of in sendUrgent, if addWeekly is true. 
            We are purposefully not sending to adminService.addName AND sendUrgent separately, 
            since only one success message should be shown. 
            */
            this.adminService.sendUrgent(formInfo, addToWeekly);

            this.clearForm();
        }
    }

    clearForm() {
        //resetting and initializing with default values
        this.nameForm.reset();
        this.name1English.reset();
        this.benbat.setValue('ben');
        this.name2English.reset();
        this.name1Hebrew.reset();
        this.benbatHebrew.setValue('בן');
        this.name2Hebrew.reset();
        this.spouseName1English.reset();
        this.spouseName2English.reset();
        this.spouseName1Hebrew.reset();
        this.spouseName2Hebrew.reset();
        this.addToWeekly.setValue(false);
    }

    cancel() {
        this.router.navigate(['admin/names']);
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
