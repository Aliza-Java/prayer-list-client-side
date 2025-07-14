import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/guest/guest.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';
import { AddNameComponent } from 'src/app/add-name/add-name.component';

@Component({
    selector: 'app-urgent',
    templateUrl: './urgent.component.html',
    styleUrls: ['./urgent.component.css']
})
export class UrgentComponent {
    @ViewChild(AddNameComponent) addNameComponent!: AddNameComponent;

    constructor(
        public guestService: GuestService,
        public daveningService: DaveningService,
        public httpService: HttpService,
        public adminService: AdminService,
        public router: Router) { }

    onSave(urgentDf: Davenfor) {
        if (confirm('Are you sure? This name will be sent out to all email subscribers.')) {

            this.adminService.sendUrgent(urgentDf)?.subscribe({
                next: () => {
                    let name = (urgentDf.nameEnglish == "") ? urgentDf.nameHebrew : urgentDf.nameEnglish;
                    this.daveningService.setSuccessMessage(
                        `The name '${name}' has been sent out to all subscribers`, true
                    );
                    this.addNameComponent.clearForm();
                    this.router.navigate(['admin/names']);
                },
                error: () => {
                    this.daveningService.setErrorMessage(
                        `We are sorry. The name '${urgentDf.nameEnglish}' could not be sent to subscribers`
                    );
                }
            });
        }
    }

    onCancel() {
        this.router.navigate(['admin/names']);
    }


}
