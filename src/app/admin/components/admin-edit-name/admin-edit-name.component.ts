import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Davenfor } from 'src/app/shared/models/davenfor.model';

@Component({
    selector: 'app-admin-edit-name',
    templateUrl: './admin-edit-name.component.html',
    styleUrls: ['./admin-edit-name.component.css']
})
export class AdminEditNameComponent implements OnInit {
    dfToEdit: Davenfor = new Davenfor;

    constructor(
        public daveningService: DaveningService, 
        public httpService: HttpService, 
        public adminService: AdminService, 
        public router: Router) { }

    async ngOnInit() {
        this.dfToEdit = this.adminService.davenforToEdit ?? new Davenfor;
    }

    onSave(editedDavenfor: any) {
        this.adminService.editDavenfor(editedDavenfor);
    }

    onCancel() {
        this.adminService.davenforToEdit = null;
        this.router.navigate(['admin/names']);
    }
}