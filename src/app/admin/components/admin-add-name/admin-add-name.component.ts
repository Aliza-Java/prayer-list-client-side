import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { GuestService } from 'src/app/guest/guest.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddNameComponent } from 'src/app/add-name/add-name.component';

@Component({
    selector: 'app-admin-add-name',
    templateUrl: './admin-add-name.component.html',
    styleUrls: ['./admin-add-name.component.css']
})
export class AdminAddNameComponent {
    @ViewChild(AddNameComponent) addNameComponent!: AddNameComponent;
    
    constructor(public guestService: GuestService, public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService, public router: Router) { }

    onSave(formInfo: any) {
        this.adminService.addDavenfor(formInfo).then(
            (response: boolean) => {
                if (response) {
                    let categoryName = this.categoryTitle(formInfo.category);
                    this.daveningService.setSuccessMessage(`The name '${formInfo.nameEnglish}' has been added to the '${categoryName}' list`, true);
                    this.addNameComponent.clearForm();
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

    categoryTitle(categoryName: string | undefined): string {

        if (categoryName == undefined)
            return "";

        if (categoryName == 'yeshua_and_parnassa')
            return 'Yeshua and Parnassa';

        categoryName = categoryName.charAt(0).toUpperCase() + (categoryName.slice(1, categoryName.length).toLowerCase());
        return categoryName;
    }

    onCancel() {
        this.router.navigate(['admin/names']);
    }
}