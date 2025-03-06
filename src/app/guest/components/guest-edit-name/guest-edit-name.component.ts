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
    english = new UntypedFormControl('', [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]);
    hebrew = new UntypedFormControl('', [Validators.required, Validators.pattern(this.daveningService.hebrewNamePattern)]);
    spouseEnglish = new UntypedFormControl('', [Validators.pattern(this.daveningService.englishNamePattern)]);
    spouseHebrew = new UntypedFormControl('', [Validators.pattern(this.daveningService.hebrewNamePattern)]);
    category = new UntypedFormControl('',  Validators.required);
    submitterToReceive = new UntypedFormControl();
    submitterEmail = new UntypedFormControl();

    constructor(public daveningService: DaveningService, public httpService: HttpService, public guestService: GuestService, public router: Router) { }

    async ngOnInit() {
        this.oldInfo = this.guestService.davenforToEdit;
        this.populateFormControls();
        this.setForm();

        //keep this in the end - after form has been set and initialized.  Otherwise doesn't recognize form-controls
        this.categories = await this.daveningService.populateCategories(); 
    }

    populateFormControls() {
        this.english.setValue(this.oldInfo.nameEnglish ? this.oldInfo.nameEnglish : null);
        this.hebrew.setValue(this.oldInfo.nameHebrew ? this.oldInfo.nameHebrew : null);

        //spouse values can be empty or not, depending on category value (if it is banim, and even then optional), as long as they are in the right language 
        //spouse values are initialized as empty string to assist with checkSpouseEnglish() and checkSpouseHebrew(), where we now only need to check if it is an empty string or not.
        this.spouseEnglish.setValue(this.oldInfo.nameEnglishSpouse ? this.oldInfo.nameEnglishSpouse : null);
        this.spouseHebrew.setValue(this.oldInfo.nameHebrewSpouse ? this.oldInfo.nameHebrewSpouse : null);

        this.category.setValue(this.oldInfo.category?? '');
        this.submitterToReceive.setValue(this.oldInfo.submitterToReceive ?? false);
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
        if (this.guestService.loading) //to avoid sending twice
            return;

        this.guestService.loading = true;
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
}