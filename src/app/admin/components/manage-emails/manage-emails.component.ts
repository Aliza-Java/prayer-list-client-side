import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Davener } from 'src/app/shared/models/davener.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
@Component({
    selector: 'app-manage-emails',
    templateUrl: './manage-emails.component.html',
    styleUrls: ['./manage-emails.component.css']
})
export class ManageEmailsComponent implements OnInit, OnDestroy {
    daveners: Davener[] = [];
    davenersChangedSub: Subscription = new Subscription;
    isLoading = false;
    addMode = false;
    country = 'Israel';
    davenerToEdit: Davener = new Davener

    whatsappEdit = document.getElementById('whatsappEdit');
    emailEdit = document.getElementById('emailEdit');
    whatsappValid = true; //don't know how to access touched of elements, therefore setting to true to avoid error message showing from start.
    emailValid = true; //don't know how to access touched of elements, therefore setting to true to avoid error message showing from start.


    constructor(public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService) {
        this.daveners = this.adminService.daveners;
    }

    ngOnInit() {
        this.davenersChangedSub = this.adminService.davenersChanged.subscribe(daveners => {
            this.daveners = daveners;
        });
        this.daveners = this.adminService.daveners; //better safe - ngInit happens for sure...


        //sending to resetDavener() didn't work at this point.
        this.davenerToEdit = new Davener(-1, '', '', 0, false); //html will check if any davener's id is equal to davenerToEdit's id, this prevents an undefined value
    }

    onEdit(davener: Davener) {
        Object.assign(this.davenerToEdit, davener); //important for ngModel
        console.log("onEdit()");

    }

    onSendEdit() {
        if (this.isLoading)
            return;

        this.isLoading = true;
        console.log("onSendEdit()");

        this.adminService.editDavener(this.davenerToEdit);

        this.resetDavener();  //switching it back to default so that no davener matches davenerToEdit's id.
        this.isLoading = false;
    }

    onDelete(davener: Davener) { 
        if (confirm('Are you sure you want to remove the email ' + davener.email + ' from the davening list?')) {
            this.adminService.deleteDavener(davener.id, davener.email);
        }
    }

    onDeactivate(davener: Davener) {
        if (this.daveningService.loading())
            return;

        console.log("onDeactivate()");

        this.adminService.deactivateDavener(davener);
    }

    onActivate(davener: Davener) {
        if (this.daveningService.loading())
            return;

        console.log("onActivate()");

        this.adminService.activateDavener(davener);
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
        if (this.isLoading)
            return;

        this.isLoading = true;

        if (info.whatsapp == "") {
            info.whatsapp = 0; //I want it to be defined as text (no up-and-down arrows) but server doesn't like "" as an empty value, accepts only numbers
        }
        const davenerToAdd = new Davener(-1, info.country, info.email, info.whatsapp, info.activate);
        this.adminService.addDavener(davenerToAdd);
        this.addMode = false;
        this.isLoading = false;
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

    resetDavener() {
        const undefinedDavener = new Davener(-1, '', '', 0, false);
        Object.assign(this.davenerToEdit, undefinedDavener);
    }

    ngOnDestroy() {
        if (this.davenersChangedSub)
            this.davenersChangedSub.unsubscribe();
    }

}
