import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Davener } from 'src/app/shared/models/davener.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { FilterActivePipe } from 'src/app/shared/filters/filter-active.pipe'; //necessary for filter in html
import { NgForm } from '@angular/forms';



@Component({
    selector: 'app-manage-emails',
    templateUrl: './manage-emails.component.html',
    styleUrls: ['./manage-emails.component.css']
})
export class ManageEmailsComponent implements OnInit, OnDestroy {
    daveners: Davener[];
    davenersChangedSub: Subscription;
    isLoading = false;
    addMode = false;
    country = 'Israel';
    davenerToEdit: Davener;
    whatsappEdit = document.getElementById('whatsappEdit');
    emailEdit = document.getElementById('emailEdit');
    whatsappValid = true; //don't know how to access touched of elements, therefore setting to true to avoid error message showing from start.
    emailValid = true; //don't know how to access touched of elements, therefore setting to true to avoid error message showing from start.
    

        constructor(public daveningService: DaveningService, public httpService: HttpService) { }

    ngOnInit() {
        this.davenersChangedSub = this.daveningService.davenersChanged.subscribe(daveners => {
            this.daveners = daveners;
        });
        this.httpService.getDaveners();
        
        //sending to resetDavener() didn't work at this point.
        this.davenerToEdit = new Davener(-1, null, null, null, false); //html will check if any davener's id is equal to davenerToEdit's id, this prevents an undefined value
    }


    onEdit(davener: Davener) {
        Object.assign(this.davenerToEdit, davener); //important for ngModel
    }

    onSendEdit() {
        this.httpService.editDavener(this.davenerToEdit);
        this.resetDavener();  //switching it back to default so that no davener matches davenerToEdit's id.
    }

    onDelete(davener: Davener) {
        if (confirm('Are you sure you want to remove the email ' + davener.email + ' and all names associated with it?')) {
            this.httpService.deleteDavener(davener.id);
        }
    }

    onDisactivate(davener: Davener) {
        this.isLoading = true;
        this.httpService.disactivateDavener(davener)
            .subscribe(  //subscription is here so that it directly affects the loading icon
                () => {
                    this.daveningService.changeToDisactivate(davener);
                    this.isLoading = false;
                },
                error => {
                    console.log(error);
                    this.isLoading = false;
                }
            );
    }

    onActivate(davener: Davener) {
        this.isLoading = true;
        this.httpService.activateDavener(davener)
            .subscribe(
                () => {
                    this.daveningService.changeToActivate(davener);
                    this.isLoading = false;
                },
                error => {
                    console.log(error);
                    this.isLoading = false;
                }
            );
    }

    allowToAdd() {
        this.addMode = true;
    }

    emailValidator(emailElement: any) {
           this.emailValid = emailElement.checkValidity();
    }

    whatsappValidator(whatsappElement: any) {
        this.whatsappValid = whatsappElement.checkValidity();
    }

    onAddDavener(info: any) {
        const davenerToAdd = new Davener(-1, info.country, info.email, info.whatsapp, true);
        this.httpService.addDavener(davenerToAdd);
        //dForm.reset();
        this.addMode = false;
    }

    onCancelAdd(dForm: NgForm) {
        this.addMode = false;
        dForm.reset(); //cleaning form
        this.country = 'Israel'; //resetting dropdown too
   
    }

    onCancelEdit() {
        //resetting items for future edit.
        this.resetDavener();
        this.emailValid = true;
        this.whatsappValid = true;
    }

    resetDavener(){
        const undefinedDavener = new Davener(-1, '', '', 0, false);
        Object.assign(this.davenerToEdit, undefinedDavener);
    }

    ngOnDestroy() {
        this.davenersChangedSub.unsubscribe();
    }

}
