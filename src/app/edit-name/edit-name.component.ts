import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';

@Component({
    selector: 'app-edit-name',
    templateUrl: './edit-name.component.html',
    styleUrls: ['./edit-name.component.css']
})
export class EditNameComponent implements OnInit {
    @Input() df: any; // data coming from parent
    @Output() save = new EventEmitter<any>(); // event to send data back
    @Output() cancelEvent = new EventEmitter<void>();

    editedDf: Davenfor = {};

    nameForm: FormGroup = new FormGroup({});
    categories: string[] = []; //creating here so it is ready to populate and recognize later
    nameError = false;
    spouseError = false;

    //declaring form-controls as variables, to shorten reference to them
    english: FormControl = new FormControl;
    hebrew: FormControl = new FormControl;
    spouseEnglish: FormControl = new FormControl;
    spouseHebrew: FormControl = new FormControl;
    category: FormControl = new FormControl;
    submitterToReceive: FormControl = new FormControl;
    userEmail: FormControl = new FormControl;

    constructor(
        public daveningService: DaveningService,
        public httpService: HttpService,
        public adminService: AdminService,
        public router: Router) { }

    async ngOnInit() {
        this.editedDf = { ...this.df }; //this is a copy

        this.populateFormControls();
        this.setForm();

        //Populating category array from Server
        this.categories = await this.daveningService.populateCategories();

    }

    populateFormControls() {
        this.english = new FormControl(this.editedDf.nameEnglish ? this.editedDf.nameEnglish : "", [Validators.pattern(this.daveningService.englishNamePattern)]);
        this.hebrew = new FormControl(this.editedDf.nameHebrew ? this.editedDf.nameHebrew : "", [Validators.pattern(this.daveningService.hebrewNamePattern)]);

        //One full spouse name should be in if Banim 
        //spouse values are initialized as empty string to assist with checkSpouseEnglish() and checkSpouseHebrew(), where we now only need to check if it is an empty string or not.
        this.spouseEnglish = new FormControl(this.editedDf.nameEnglishSpouse ? this.editedDf.nameEnglishSpouse : "", [Validators.pattern(this.daveningService.englishNamePattern)]);
        this.spouseHebrew = new FormControl(this.editedDf.nameHebrewSpouse ? this.editedDf.nameHebrewSpouse : "", [Validators.pattern(this.daveningService.hebrewNamePattern)]);

        this.category = new FormControl(this.editedDf.category, Validators.required); //default value is 'select category'
        // this.submitterToReceive = new FormControl(this.editedDf.submitterToReceive); TODO: enable when allow submitterToReceive value
        this.submitterToReceive = new FormControl({ value: true, disabled: true });
    }

    setForm() {
        this.nameForm = new FormGroup({
            'english': this.english,
            'hebrew': this.hebrew,
            'spouseEnglish': this.spouseEnglish,
            'spouseHebrew': this.spouseHebrew,
            'category': this.category,
            'submitterToReceive': this.submitterToReceive,
            'userEmail': this.userEmail
        });
    }

    onSubmit() {
        this.checkName();
        if (this.nameError)
            return;
        
        this.checkSpouse();

        if (this.spouseError)
            return;

        /*If spouse name will be full and valid, will populate later.  
        Initializing before 'banim' condition so that recognized in 'formInfo' population below*/
        let form = this.nameForm; //shortening references in this function

        let updatedInfo: Davenfor = new Davenfor(this.editedDf.id,
            form.get('category')?.value,
            this.editedDf.createdAt,
            this.editedDf.deletedAt,
            this.editedDf.confirmedAt,
            form.get('english')?.value,
            form.get('spouseEnglish')?.value,
            form.get('hebrew')?.value,
            form.get('spouseHebrew')?.value,
            "", //empty note
            form.get('submitterToReceive')?.value,
            new Date().toISOString().slice(0, 19),
            this.editedDf.userEmail
        );

        this.save.emit(updatedInfo);
    }

    checkName() {
        if ((this.nameForm.get('english')?.value == null || this.nameForm.get('english')?.value.trim() == '') &&
            (this.nameForm.get('hebrew')?.value == null || this.nameForm.get('hebrew')?.value.trim() == '')) {
            this.nameError = true;
        }
        else
            this.nameError = false;
    }

    checkSpouse() {
        console.log(this.nameForm.get('category')?.value);
        console.log(this.nameForm.get('spouseEnglish')?.value);
        console.log(this.nameForm.get('spouseHebrew')?.value);
        if (this.nameForm.get('category')?.value == 'banim' && this.spouseEmpty()) {
            this.spouseError = true;
        }
        else
            this.spouseError = false;
    }

    spouseEmpty() {
        return (this.nameForm.get('spouseEnglish')?.value == null || this.nameForm.get('spouseEnglish')?.value.trim() == '') &&
            (this.nameForm.get('spouseHebrew')?.value == null || this.nameForm.get('spouseHebrew')?.value.trim() == '');
    }

    cancel() {
        this.cancelEvent.emit();
    }
}