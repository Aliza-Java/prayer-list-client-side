import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { GuestService } from 'src/app/guest/guest.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from '../shared/models/davenfor.model';

@Component({
    selector: 'app-add-name',
    templateUrl: './add-name.component.html',
    styleUrls: ['./add-name.component.css']
})
export class AddNameComponent implements OnInit {
    @Input() parentComp = ""; // data coming from parent
    @Output() save = new EventEmitter<any>(); // event to send data back
    @Output() cancelEvent = new EventEmitter<void>();

    nameForm: FormGroup = new FormGroup({});
    categories: string[] = []; //creating here so it is ready to populate and recognize later
    chosenCategory: string = '';
    spouseEnglishError = false;
    spouseHebrewError = false;
    spouseError = false;

    //declaring form-controls as variables, to shorten reference to them
    name1English: FormControl = new FormControl;
    benbat: FormControl = new FormControl;
    name2English: FormControl = new FormControl;
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
    addToWeekly: FormControl = new FormControl;
    note: FormControl = new FormControl;

    constructor(public guestService: GuestService, public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService, public router: Router) { }

    async ngOnInit() {
        this.createFormControls();
        this.setForm();

        this.categories = await this.daveningService.populateCategories();
    }

    createFormControls() {
        this.name1English = new FormControl(null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]);
        this.benbat = new FormControl('ben');
        this.name2English = new FormControl(null, [Validators.required, Validators.pattern(this.daveningService.englishNamePattern)]);
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
        this.submitterToReceive = new FormControl({ value: true, disabled: true });
        if (this.parentComp == 'urgent' || this.parentComp == 'admin') 
                   this.userEmail = new FormControl("", [Validators.required, Validators.email]); //email is not used in this form, so it is empty
        
        if (this.parentComp == 'urgent') 
            this.note = new FormControl("", [Validators.maxLength(500)]); //note is required in urgent form, but not in admin form
    }

    setForm() {
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
            'userEmail': this.userEmail, 
            'addToWeekly':this.addToWeekly, 
            'note': this.note            
        });
    }

    onSubmit() {

        //If spouse name will be full and valid, will populate later.  
        if (this.nameForm.get('category')?.value == 'banim') {
            this.checkSpouse(); //check one more time in case submit was clicked without blurring and onsetting this check
            if (this.spouseError || this.spouseEnglishError || this.spouseHebrewError)
                return;
        }

        if (this.nameForm.get('name')?.invalid ||
            (this.nameForm.get('spouse')?.invalid && this.nameForm.get('category')?.value === 'banim') ||
            this.nameForm.get('category')?.invalid ||
            (this.needEmail() && this.nameForm.get('userEmail')?.invalid) )
            return;

        let spouseEnglishFull = "";
        let spouseHebrewFull = "";

        let form = this.nameForm; //shortening all references in this function
        const chosenCategory = (form.get('category')?.value || '');
        const englishName = form.get('name.english1')?.value + " " + form.get('name.benBat')?.value + " " + form.get('name.english2')?.value;
        const hebrewName = form.get('name.hebrew1')?.value + " " + form.get('name.benBatHebrew')?.value + " " + form.get('name.hebrew2')?.value;
        let userEmail = (this.parentComp == 'admin' || form.get('addToWeekly')?.value) ? form.get('userEmail')?.value : ""; //empty email signals it should not be added to weekly emails
        
        let submitterToReceive = form.get('submitterToReceive')?.value;
        let note = (this.parentComp == 'urgent') ? form.get('note')?.value : ""; 

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

        let now = new Date().toISOString().slice(0, 19);

        let formInfo = new Davenfor(
            -1,
            chosenCategory,
            now,
            "",
            now,
            englishName,
            spouseEnglishFull,
            hebrewName,
            spouseHebrewFull,
            note, //note
            submitterToReceive,
            now, //updatedAt,
            userEmail
        );

        this.save.emit(formInfo); //emit the form data to the parent component
        //todo in future: what if got bad response, would like to clear form only on good response
    }

    clearForm() {
        //resetting and initializing with default values
        this.nameForm.reset();
        this.benbat.setValue('ben');
        this.benbatHebrew.setValue('בן');
        this.category.setValue(''); //default value is 'select category'
        this.chosenCategory = '';
    }

    cancel() {
        this.cancelEvent.emit();
    }

    checkSpouse() {
        if ((!this.spouseName1English.value
            && this.spouseName2English.value)
            ||
            this.spouseName1English.value
            && !this.spouseName2English.value)
            this.spouseEnglishError = true;
        else this.spouseEnglishError = false;

        if ((!this.spouseName1Hebrew.value
            && this.spouseName2Hebrew.value)
            ||
            this.spouseName1Hebrew.value
            && !this.spouseName2Hebrew.value)
            this.spouseHebrewError = true;
        else this.spouseHebrewError = false;

        if (!this.spouseName1English.value
            && !this.spouseName2English.value
            && !this.spouseName1Hebrew.value
            && !this.spouseName2Hebrew.value)
            this.spouseError = true;
        else this.spouseError = false;
    }

    needEmail(): boolean {
        //if parent component is urgent, email is required, if parent component is admin, email is not required, but if addToWeekly is true, then email is required
        return (this.parentComp == 'admin' || (this.parentComp == 'urgent' && this.nameForm.get('addToWeekly')?.value));
    }
}