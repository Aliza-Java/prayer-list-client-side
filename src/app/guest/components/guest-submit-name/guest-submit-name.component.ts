import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleDavenfor } from '../../../shared/models/simple-davenfor.model';
import { DaveningService } from '../../../shared/services/davening.service';
import { GuestService } from '../../guest.service';

@Component({
    selector: 'app-guest-submit-name',
    templateUrl: './guest-submit-name.component.html',
    styleUrls: ['./guest-submit-name.component.css']
})
export class GuestSubmitNameComponent implements OnInit {
    nameForm: FormGroup = new FormGroup({});
    categories: string[] = []; //creating here so it is ready to populate and recognize later
    banimNumber: number = 0; //We need the id in order to refer to it in the html (if value of category input is the one of banim)
    chosenCategory: string = '';
    spouseEnglishError = false;
    spouseHebrewError = false;

    //declaring form-controls as variables, to shorten reference to them
    benbat: FormControl = new FormControl;
    name1Hebrew: FormControl = new FormControl;
    benbatHebrew: FormControl = new FormControl;
    name2Hebrew: FormControl = new FormControl;
    spouseName1English: FormControl = new FormControl;
    spouseName2English: FormControl = new FormControl;
    spouseName1Hebrew: FormControl = new FormControl;
    spouseName2Hebrew: FormControl = new FormControl;
    category: FormControl = new FormControl;
    submitterToReceive: FormControl = new FormControl;
    userEmail: FormControl = new FormControl;

    constructor(
        public router: Router,
        public guestService: GuestService,
        private daveningService: DaveningService) { }

    async ngOnInit() {
        this.createFormControls();
        this.createForm();
        this.categories = await this.daveningService.populateCategories();
    }

    createFormControls() {
        this.benbat = new FormControl('ben');
        this.name1Hebrew = new FormControl(null, [Validators.required, Validators.pattern(this.daveningService.hebrewNamePattern)]);
        this.benbatHebrew = new FormControl('בן');
        this.name2Hebrew = new FormControl(null, [Validators.required, Validators.pattern(this.daveningService.hebrewNamePattern)]);

        //spouse values can be empty or not, depending on category value (if it is banim, and even then optional), as long as they are in the right language 
        //spouse values are initialized as empty string to assist with checkSpouseEnglish() and checkSpouseHebrew(), where we now only need to check if it is an empty string or not.
        this.spouseName1English = new FormControl("", Validators.pattern(this.daveningService.englishNamePattern));
        this.spouseName2English = new FormControl("", Validators.pattern(this.daveningService.englishNamePattern));
        this.spouseName1Hebrew = new FormControl("", Validators.pattern(this.daveningService.hebrewNamePattern));
        this.spouseName2Hebrew = new FormControl("", Validators.pattern(this.daveningService.hebrewNamePattern));

        this.category = new FormControl("", Validators.required); //default value is 'select category'
        this.submitterToReceive = new FormControl(true);
    }

    createForm() {
        this.nameForm = new FormGroup({
            'name': new FormGroup({
                'english1': new FormControl(null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]),
                'benBat': this.benbat,
                'english2': new FormControl(null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]),
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
            'submitterToReceive': this.submitterToReceive
        });
    }

    onSubmit() {
        if (this.guestService.loading) {
            return;
        }

        this.guestService.setLoading(true);
        /*If spouse name will be full and valid, will populate later.  
        Initializing before 'banim' condition so that recognized in 'formInfo' population below    */
        let spouseEnglishFull = "";
        let spouseHebrewFull = "";

        let form = this.nameForm; //shortening all references in this function
        const chosenCategory = this.guestService.getCategory(form.get('category')?.value || '');
        const englishName = form.get('name.english1')?.value + " " + form.get('name.benBat')?.value + " " + form.get('name.english2')?.value;
        const hebrewName = form.get('name.hebrew1')?.value + " " + form.get('name.benBatHebrew')?.value + " " + form.get('name.hebrew2')?.value;
        let userEmail = this.guestService.guestEmail;
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
                spouseHebrewFull = `${spouseHebrew2} בן ${spouseHebrew1}`;
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
        console.log(formInfo);

        this.guestService.addDavenfor(formInfo);
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

    cancel() {
        this.router.navigate(['guest/names']);
    }
}