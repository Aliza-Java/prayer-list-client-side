import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { AdminService } from './admin/admin.service';
import { HttpService } from './shared/services/http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
    constructor(public daveningService: DaveningService, public httpService: HttpService, public adminService: AdminService) {
    }

    ngOnInit() {
        //populating general arrays ahead of time (async)
        this.adminService.getDaveners();
        this.adminService.populateAdminDavenfors();
    }
}
