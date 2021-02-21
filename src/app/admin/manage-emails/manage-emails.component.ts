import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Davener } from 'src/app/shared/models/davener.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { FilterActivePipe } from 'src/app/shared/filters/filter-active.pipe'; //necessary for filter in html
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';



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
    

        constructor(public daveningService: DaveningService, public httpService: HttpService, public adminService:AdminService) {
            this.daveners = this.adminService.daveners;
         }

    ngOnInit() {
        this.davenersChangedSub = this.adminService.davenersChanged.subscribe(daveners => {
            this.daveners = daveners;
        });
        this.daveners = this.adminService.daveners; //better safe - ngInit happens for sure...

        
        //sending to resetDavener() didn't work at this point.
        this.davenerToEdit = new Davener(-1, null, null, null, false); //html will check if any davener's id is equal to davenerToEdit's id, this prevents an undefined value
    }


    onEdit(davener: Davener) {
        Object.assign(this.davenerToEdit, davener); //important for ngModel
    }

    onSendEdit() {
        this.httpService.editDavener(this.davenerToEdit).subscribe(
            daveners => {
                this.adminService.daveners = daveners;
                this.adminService.davenersChanged.next(daveners);
            },
            error => console.log(error)
        );

        this.resetDavener();  //switching it back to default so that no davener matches davenerToEdit's id.
    }

    onDelete(davener: Davener) {
        if (confirm('Are you sure you want to remove the email ' + davener.email + ' from the davening list?')) {
            this.httpService.deleteDavener(davener.id).subscribe(
                () => { this.adminService.getDaveners() },//refreshing list reflects deleted item.
                error => { console.log(error) } // TODO: and error message
            );
        }
    }

    onDisactivate(davener: Davener) {
        this.isLoading = true;
        this.httpService.disactivateDavener(davener)
            .subscribe(  //subscription is here so that it directly affects the loading icon
                () => {
                    this.adminService.changeToDisactivate(davener);
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
                    this.adminService.changeToActivate(davener);
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
        if(info.whatsapp==""){
            info.whatsapp=0; //I want it to be defined as text (no up-and-down arrows) but server doesn't like "" as an empty value, accepts only numbers
        }
        const davenerToAdd = new Davener(-1, info.country, info.email, info.whatsapp, true);
        this.adminService.addDavener(davenerToAdd);
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
