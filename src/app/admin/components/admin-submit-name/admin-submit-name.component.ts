import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleDavenfor } from 'src/app/shared/models/simple-davenfor.model';
import { AdminService } from 'src/app/admin/admin.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { GuestService } from 'src/app/guest/guest.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-admin-submit-name',
    templateUrl: './admin-submit-name.component.html',
    styleUrls: ['./admin-submit-name.component.css']
})
export class AdminSubmitNameComponent implements OnInit {
    nameForm: UntypedFormGroup = new UntypedFormGroup({});
    categories: string[] = []; //creating here so it is ready to populate and recognize later
    chosenCategory: string = '';
    spouseEnglishError = false;
    spouseHebrewError = false;

    //declaring form-controls as variables, to shorten reference to them
    name1English: UntypedFormControl = new UntypedFormControl;
    benbat: UntypedFormControl = new UntypedFormControl;
    name2English: UntypedFormControl = new UntypedFormControl;
    name1Hebrew: UntypedFormControl = new UntypedFormControl;
    benbatHebrew: UntypedFormControl = new UntypedFormControl;
    name2Hebrew: UntypedFormControl = new UntypedFormControl;
    spouseName1English: UntypedFormControl = new UntypedFormControl;
    spouseName2English: UntypedFormControl = new UntypedFormControl;
    spouseName1Hebrew: UntypedFormControl = new UntypedFormControl;
    spouseName2Hebrew: UntypedFormControl = new UntypedFormControl;
    category: UntypedFormControl = new UntypedFormControl;
    submitterToReceive: UntypedFormControl = new UntypedFormControl;
    userEmail: UntypedFormControl = new UntypedFormControl;

    constructor(public guestService: GuestService, public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService, public router: Router) { }

    async ngOnInit() {
        this.createFormControls();
        this.setForm();

        this.categories = await this.daveningService.populateCategories();
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
        this.submitterToReceive = new UntypedFormControl(true);
        this.userEmail = new UntypedFormControl(null, [Validators.required, Validators.email]);

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
            'submitterToReceive': this.submitterToReceive,
            'userEmail': this.userEmail
        });
    }

    onSubmit() {
        /*If spouse name will be full and valid, will populate later.  
        Initializing before 'banim' condition so that recognized in 'formInfo' population below*/
        let spouseEnglishFull = "";
        let spouseHebrewFull = "";

        let form = this.nameForm; //shortening all references in this function
        const chosenCategory = (form.get('category')?.value || '');
        const englishName = form.get('name.english1')?.value + " " + form.get('name.benBat')?.value + " " + form.get('name.english2')?.value;
        const hebrewName = form.get('name.hebrew1')?.value + " " + form.get('name.benBatHebrew')?.value + " " + form.get('name.hebrew2')?.value;
        let userEmail = form.get('userEmail')?.value;
        let submitterToReceive = form.get('submitterToReceive')?.value;

        if (chosenCategory == "banim") {
            //overriding an input such as "null בן null", filling only if have name in both parts of spouse name. (English and Hebrew independent)

            let spouseEnglish1 = form.get('spouse.english1')?.value;
            let spouseEnglish2 = form.get('spouse.english2')?.value;
            let spouseHebrew1 = form.get('spouse.hebrew1')?.value;
            let spouseHebrew2 = form.get('spouse.hebrew2')?.value;

            if (spouseEnglish1 && spouseEnglish2)
                spouseEnglishFull = `${spouseEnglish1} ben ${spouseEnglish2}`; //It must be ben, as it is the husband

            if (spouseHebrew1 && spouseHebrew2)
                spouseHebrewFull = `${spouseHebrew1} בן ${spouseHebrew2}`; //This order concats it correctly
        }

        let formInfo = new SimpleDavenfor(
            chosenCategory,
            userEmail,
            hebrewName,
            englishName,
            spouseHebrewFull,
            spouseEnglishFull,
            submitterToReceive
        );

        this.adminService.addDavenfor(formInfo).then(
            (response: boolean) => {
                if (response) {
                    this.daveningService.setSuccessMessage(`The name '${formInfo.nameEnglish}' has been added to the '${formInfo.category}' list`, true);
                    this.router.navigate(['admin/names']);
                } else {
                    this.daveningService.setErrorMessage(`We are sorry.  There was an error adding ${formInfo.nameEnglish}`);
                }
            }).catch(
                () => {
                    this.daveningService.setErrorMessage(`We are sorry.  There was an error adding ${formInfo.nameEnglish}`);
                }
            );
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
        this.submitterToReceive.setValue(true);
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

    checkBanim() {
        return (this.nameForm.get('category')?.value != null &&
            this.nameForm.get('category')?.value == 'banim');
    }
}