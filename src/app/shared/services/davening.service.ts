import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Category } from '../models/category.model';
import { Davenfor } from '../models/davenfor.model';
import { SimpleDavenfor } from '../models/simple-davenfor.model';
import { Submitter } from '../models/submitter.model';

@Injectable({
    providedIn: 'root'
})
export class DaveningService {

    errorMessage: string;
    successMessage: string;
    categories = ['Refua', 'Banim', 'Shidduch', 'Yeshuah', 'Soldiers', 'space-filler'];
    //Todo: make categories come from DB
    emailChanged = new Subject<string>();
    guestEmail:string = null;

    constructor() { }

    getCategories() {
        return this.categories;
    }



    addDavenfor(rawInformation: SimpleDavenfor) {
        const newDavenfor = new Davenfor(
            this.getSubmitter(rawInformation.submitterEmail),
            this.getCategory(rawInformation.categoryName),
            rawInformation.nameHebrew,
            rawInformation.nameEnglish,
            rawInformation.nameHebrewSpouse,
            rawInformation.nameEnglishSpouse,
            rawInformation.submitterToReceive,
            new Date().toString(),
            null, //server will set the right expiring date
            new Date().toString(),
            new Date().toString()
        );
        console.log(newDavenfor);
        // send to server
    }

    getSubmitter(emailText: string) {
        //todo: reach out to server and get real submitter.
        return new Submitter();
    }

    getCategory(categoryName: string) {
        //todo: reach out to server and get real category.
        return new Category();
    }

}
