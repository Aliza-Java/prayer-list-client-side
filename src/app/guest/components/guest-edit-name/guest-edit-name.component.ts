import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { GuestService } from '../../guest.service';

@Component({
    selector: 'app-guest-edit-name',
    templateUrl: './guest-edit-name.component.html',
    styleUrls: ['./guest-edit-name.component.css']
})
export class GuestEditNameComponent implements OnInit {
    oldInfo: Davenfor = new Davenfor;
    updatedInfo: Davenfor = new Davenfor;
    nameForm: UntypedFormGroup = new UntypedFormGroup({});
    categories: string[] = []; //creating here so it is ready to populate and recognize later
    banimNumber: number = 0; //We need the id in order to refer to it in the html (if value of category input is the one of banim)
    spouseEnglishError = false;
    spouseHebrewError = false;

    //declaring form-controls as variables, to shorten reference to them
    english: UntypedFormControl = new UntypedFormControl;
    hebrew: UntypedFormControl = new UntypedFormControl;
    spouseEnglish: UntypedFormControl = new UntypedFormControl;
    spouseHebrew: UntypedFormControl = new UntypedFormControl;
    category: UntypedFormControl = new UntypedFormControl;
    submitterToReceive: UntypedFormControl = new UntypedFormControl;
    submitterEmail: UntypedFormControl = new UntypedFormControl;

    constructor(public daveningService: DaveningService, public httpService: HttpService, public guestService: GuestService, public router: Router) { }

    ngOnInit() {
        this.oldInfo = this.guestService.davenforToEdit;
        this.populateFormControls();
        this.setForm();

        //Populating category array from Server
        this.categories = this.daveningService.categories;
    }

    populateFormControls() {
        this.english = new UntypedFormControl(this.oldInfo.nameEnglish ? this.oldInfo.nameEnglish : null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]);
        this.hebrew = new UntypedFormControl(this.oldInfo.nameHebrew ? this.oldInfo.nameHebrew : null, [Validators.required, Validators.pattern(this.daveningService.hebrewNamePattern)]);

        //spouse values can be empty or not, depending on category value (if it is banim, and even then optional), as long as they are in the right language 
        //spouse values are initialized as empty string to assist with checkSpouseEnglish() and checkSpouseHebrew(), where we now only need to check if it is an empty string or not.
        this.spouseEnglish = new UntypedFormControl(this.oldInfo.nameEnglishSpouse ? this.oldInfo.nameEnglishSpouse : null, [Validators.pattern(this.daveningService.englishNamePattern)]);
        this.spouseHebrew = new UntypedFormControl(this.oldInfo.nameHebrewSpouse ? this.oldInfo.nameHebrewSpouse : null, [Validators.pattern(this.daveningService.hebrewNamePattern)]);

        this.category = new UntypedFormControl(this.oldInfo.category?? '', Validators.required); //default value is 'select category'
        this.submitterToReceive = new UntypedFormControl(this.oldInfo.submitterToReceive);
    }

    setForm() {
        this.nameForm = new UntypedFormGroup({
            'english': this.english,
            'hebrew': this.hebrew,
            'spouseEnglish': this.spouseEnglish,
            'spouseHebrew': this.spouseHebrew,
            'category': this.category,
            'submitterToReceive': this.submitterToReceive,
        });
    }

    onSubmit() {
        /*If spouse name will be full and valid, will populate later.  
        Initializing before 'banim' condition so that recognized in 'formInfo' population below*/
        let form = this.nameForm; //shortening references in this function

        let updatedInfo: Davenfor = new Davenfor(this.oldInfo.id,
            '', //guest email will be added in guestService
            this.guestService.getCategory(form.get('category')?.value || ''),
            form.get('hebrew')?.value,
            form.get('english')?.value,
            form.get('spouseHebrew')?.value,
            form.get('spouseEnglish')?.value,
            form.get('submitterToReceive')?.value,
            this.oldInfo.lastConfirmedAt,
            this.oldInfo.expireAt,
            this.oldInfo.createdAt,
            new Date().toISOString().split('T')[0]);

        this.guestService.editDavenfor(updatedInfo);
    }

    cancel() {
        this.guestService.davenforToEdit = new Davenfor;
        this.router.navigate(['guest/names']);
    }

    //TODO: replace with pattern validators
    // checkSpouseEnglish() {
    //    if(/*  */       ) {
    //         this.spouseEnglishError = true;
    //     }
    //     else this.spouseEnglishError = false;
    // }

    //TODO: replace with pattern validators
    // checkSpouseHebrew() {
    //     if ((!this.spouseName1Hebrew.value
    //         && this.spouseName2Hebrew.value)
    //         ||
    //         (!this.spouseName2Hebrew.value
    //             && this.spouseName1Hebrew.value)) {
    //         this.spouseHebrewError = true;
    //     }
    //     else this.spouseHebrewError = false;
    // }
}