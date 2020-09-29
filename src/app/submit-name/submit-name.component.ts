import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SimpleDavenfor } from '../shared/models/simple-davenfor.model';
import { DaveningService } from '../shared/services/davening.service';

@Component({
    selector: 'app-submit-name',
    templateUrl: './submit-name.component.html',
    styleUrls: ['./submit-name.component.css']
})
export class SubmitNameComponent implements OnInit {
    nameForm: FormGroup;
    categories: string[]; //creating here so it is ready to populate and recognize later
    chosenCategory: string;
    guestEmail;

    constructor(private daveningService: DaveningService) { }

    ngOnInit() {
        this.categories = this.daveningService.getCategories();

        this.daveningService.emailChanged.subscribe(
            (updatedEmail) => {
                this.daveningService.guestEmail = updatedEmail;
                alert(updatedEmail + " local");
            }
        );

        this.nameForm = new FormGroup({
            'name1English': new FormControl(null),
            'benBat': new FormControl('ben'),
            'name2English': new FormControl(null),
            'name1Hebrew': new FormControl(null),
            'benBatHebrew': new FormControl('בן'),
            'name2Hebrew': new FormControl(null),
            'spouseName1English': new FormControl(null),
            'spouseName2English': new FormControl(null),
            'spouseName1Hebrew': new FormControl(null),
            'spouseName2Hebrew': new FormControl(null),
            'category': new FormControl(null),
            'submitterToReceive': new FormControl(true)
            //todo: why is submitterToReceive not true to begin with?
        });

    }

    onSubmit() {
        //constructing names first
        const englishName = this.nameForm.value['name1English'] + " " + this.nameForm.value['benBat'] + " " + this.nameForm.value['name2English'];
        const hebrewName = this.nameForm.value['name1Hebrew'] + " " + this.nameForm.value['benBatHebrew'] + " " + this.nameForm.value['name2Hebrew'];



        let spouseEnglishName = null;
        let spouseHebrewName = null;
        if (this.nameForm.get('category').value == 'Banim') {
            spouseEnglishName = this.nameForm.value['spouseName1English'] + " ben " + this.nameForm.value['spouseName2English'];
            spouseHebrewName = this.nameForm.value['spouseName1Hebrew'] + " בן " + this.nameForm.value['spouseName2Hebrew'];
        }
        const basicInfo: SimpleDavenfor = new SimpleDavenfor(
            this.nameForm.value['category'],
            this.daveningService.guestEmail,
            hebrewName,
            englishName,
            spouseHebrewName,
            spouseEnglishName,
            this.nameForm.value['submitterToReceive']
        );

        this.daveningService.addDavenfor(basicInfo);
    }

}
